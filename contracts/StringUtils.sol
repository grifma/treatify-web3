pragma solidity >=0.4.22 <0.6.0;

library StringUtils {

    function strConcat(string memory _a, string memory _b, string memory _c, string memory _d, string memory _e) pure internal returns (string memory){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (uint i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (uint i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (uint i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (uint i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return string(babcde);
    }

    function strConcat(string memory _a, string memory _b, string memory _c, string memory _d) pure internal returns (string memory) {
        return strConcat(_a, _b, _c, _d, "");
    }

    function strConcat(string memory _a, string memory _b, string memory _c) pure internal returns (string memory) {
        return strConcat(_a, _b, _c, "", "");
    }

    function strConcat(string memory _a, string memory _b) pure internal returns (string memory) {
        return strConcat(_a, _b, "", "", "");
    }

    function toString(address _x) pure internal returns (string memory) {
      bytes memory b = new bytes(20);
      for (uint i = 0; i < 20; i++)
          b[i] = byte(uint8(uint(_x) / (2**(8*(19 - i)))));
      return string(b);
    }

}
