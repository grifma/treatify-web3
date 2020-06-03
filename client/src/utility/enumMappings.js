function humanReadableTreatyStatus(int) {
  const i = parseInt(int);
  switch (i) {
    case 0:
      return "Draft";
    case 1:
      return "Active";
    case 2:
      return "Binding";
    case 3:
      return "Broken";
    case 4:
      return "MutuallyWithdrawn";
    default:
      return "Unknown";
  }
}

function humanReadableSignatureStatus(int) {
  const i = parseInt(int);
  switch (i) {
    case 0:
      return "Unsigned";
    case 1:
      return "Signed";
    case 2:
      return "Withdrawn";
    case 3:
      return "Broken";
  }
}

function humanReadableTreatyType(int) {
  const i = parseInt(int);
  switch (i) {
    case 0:
      return "ProjectToFounder";
    case 1:
      return "ProjectToMentor";
    case 2:
      return "Volunteer";
  }
}

exports.humanReadableTreatyStatus = humanReadableTreatyStatus;
exports.humanReadableSignatureStatus = humanReadableSignatureStatus;
exports.humanReadableTreatyType = humanReadableTreatyType;
