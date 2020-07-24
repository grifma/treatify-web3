var Treaty = artifacts.require("Treaty");

contract("Treaty", async (accounts) => {
  var registrar = accounts[0];
  var partyA = accounts[1];
  var partyB = accounts[2];
  var partyC = accounts[3];
  var lawyer = accounts[6];

  it("can deploy with name", async () => {
    let treaty = await Treaty.deployed();
    let name = await treaty.name.call();
    assert.equal(name, "Test Treaty", "Name not correct");
  });

  it("three signers can join", async () => {
    let treaty = await Treaty.deployed();
    let txJoin1 = await treaty.registerAsSigner({ from: partyA });
    let txJoin2 = await treaty.registerAsSigner({ from: partyB });
    let txJoin3 = await treaty.registerAsSigner({ from: partyC });
    let numSignatures = await treaty.getNumSignatures.call();
    assert.equal(Number(numSignatures.valueOf()), 3, "should be 3 signers");
  });

  it("can make treaty active", async () => {
    let treaty = await Treaty.deployed();
    let txMakeActive = await treaty.makeActive({ from: partyA });
    let treatyState = await treaty.treatyState.call();
    assert.equal(treatyState.valueOf(), 1, "treaty should be active");
  });

  it("can write to treaty", async () => {
    let treaty = await Treaty.deployed();
    let txWrite1 = await treaty.writeToTreaty("Equal equity split", {
      from: partyA,
    });
    let txWrite2 = await treaty.writeToTreaty("One member one vote", {
      from: partyB,
    });
    let treatyText1 = await treaty.unsignedTreatyText.call(1);
    let treatyText2 = await treaty.unsignedTreatyText.call(2);
    //console.log('--->' + treatyText1 + '\n' + treatyText2);
    assert.equal(
      treatyText1.valueOf(),
      "Equal equity split",
      "text not correct"
    );
    assert.equal(
      treatyText2.valueOf(),
      "One member one vote",
      "text not correct"
    );
  });

  it("all parties can agree", async () => {
    let treaty = await Treaty.deployed();
    let txAgreeA = await treaty.signTreaty({ from: partyA });
    let txAgreeB = await treaty.signTreaty({ from: partyB });
    let txAgreeC = await treaty.signTreaty({ from: partyC });
    assert.equal(
      txAgreeC.logs[1].event,
      "SignedByAll",
      "signedbyall event not emitted"
    );
  });

  it("all text now signed", async () => {
    let treaty = await Treaty.deployed();
    assert.equal(
      await treaty.signedTreatyText.call(0).valueOf(),
      "Initial text",
      "text not correct or text not signed"
    );
    assert.equal(
      await treaty.signedTreatyText.call(1).valueOf(),
      "Equal equity split",
      "text not correct or text not signed"
    );
    assert.equal(
      await treaty.signedTreatyText.call(2).valueOf(),
      "One member one vote",
      "text not correct or text not signed"
    );
  });

  it("signature state is reset", async () => {
    let treaty = await Treaty.deployed();
    assert.equal(
      await treaty.signatureState.call(partyA).valueOf(),
      0,
      "signature state is not Unsigned"
    );
    assert.equal(
      await treaty.signatureState.call(partyB).valueOf(),
      0,
      "signature state is not Unsigned"
    );
    assert.equal(
      await treaty.signatureState.call(partyC).valueOf(),
      0,
      "signature state is not Unsigned"
    );
  });

  it("more text can be added as discussions continue", async () => {
    let treaty = await Treaty.deployed();
    await treaty.writeToTreaty("Borderless organisation", { from: partyC });
    assert.equal(
      await treaty.unsignedTreatyText.call(0).valueOf(),
      "Borderless organisation",
      "text not on unsigned list"
    );
  });

  it("additional text can be agreed on", async () => {
    let treaty = await Treaty.deployed();
    await treaty.signTreaty({ from: partyA });
    await treaty.signTreaty({ from: partyB });
    await treaty.signTreaty({ from: partyC });
    assert.equal(
      await treaty.signedTreatyText.call(3).valueOf(),
      "Borderless organisation",
      "text not on signed list"
    );
  });

  it("can time lock", async () => {
    let treaty = await Treaty.deployed();
    await treaty.lockFor(2, { from: partyA });
    assert.equal(
      await treaty.locked.call().valueOf(),
      true,
      "state not locked"
    );
  });

  it("no changes while locked", async () => {
    let treaty = await Treaty.deployed();
    try {
      await treaty.withdrawFromTreaty({ from: partyA });
      assert.fail("Expected throw not received");
    } catch (error) {
      const expectedError =
        error.message.search("Treaty must be unlocked") >= 0;
      assert(
        expectedError,
        "Treaty must be unlocked, got '" + error + "' instead"
      );
    }
  });

  it("can wait until unlock", async () => {
    console.log("Counting to 10...");
    await timeout(10000);
    console.log("Done.");
    let treaty = await Treaty.deployed();
    let locked = await treaty.getLocked.call();
    assert.equal(locked, false, "Treaty has not unlocked");
  });

  it("registrar can change lawyer address", async () => {
    let treaty = await Treaty.deployed();
    await treaty.changeLawyer(lawyer, { from: registrar });
    assert.equal(
      await treaty.lawyerAddress.call().valueOf(),
      lawyer,
      "lawyer not correct"
    );
  });

  it("lawyer can make treaty binding", async () => {
    let treaty = await Treaty.deployed();
    await treaty.makeBinding({ from: lawyer });
    assert.equal(
      await treaty.treatyState.call().valueOf(),
      2,
      "state not binding"
    );
  });

  it("no changes or withdraws permitted while binding", async () => {
    let treaty = await Treaty.deployed();
    try {
      await treaty.writeToTreaty("frhuifuiowhfw", { from: partyA });
      assert.fail("Expected throw not received");
    } catch (error) {
      const expectedError =
        error.message.search("Treaty is not in expected state") >= 0;
      assert(
        expectedError,
        "Treaty is not in expected state, got '" + error + "' instead"
      );
    }
    try {
      await treaty.withdrawFromTreaty({ from: partyC });
      assert.fail("Expected throw not received");
    } catch (error) {
      const expectedError =
        error.message.search("Treaty is not in expected state") >= 0;
      assert(
        expectedError,
        "Treaty is not in expected state, got '" + error + "' instead"
      );
    }
  });

  it("lawyer can unbind treaty", async () => {
    let treaty = await Treaty.deployed();
    await treaty.undoBinding({ from: lawyer });
    assert.equal(
      await treaty.treatyState.call().valueOf(),
      1,
      "state not active"
    );
  });

  it("treaty broken if party withdraws", async () => {
    let treaty = await Treaty.deployed();
    await treaty.withdrawFromTreaty({ from: partyC });
    assert.equal(
      await treaty.treatyState.call().valueOf(),
      3,
      "state not broken"
    );
  });

  it("treaty mutually withdrawn if all parties withdraw", async () => {
    let treaty = await Treaty.deployed();
    await treaty.withdrawFromTreaty({ from: partyA });
    await treaty.withdrawFromTreaty({ from: partyB });
    assert.equal(
      await treaty.treatyState.call().valueOf(),
      4,
      "state not mutually withdrawn"
    );
  });

  ////////
  // Helper functions
  ////////

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function printLogs(tx) {
    for (var i = 0; i < tx.logs.length; i++) {
      var log = tx.logs[i];
      console.log(log);
      console.log(JSON.stringify(log));
    }
  }

  function printLogs(tx, logName) {
    for (var i = 0; i < tx.logs.length; i++) {
      var log = tx.logs[i];
      if (log.event == logName) {
        console.log(log);
        console.log(JSON.stringify(log));
      }
    }
  }
});
