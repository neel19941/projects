
export class IdentityProof{
  identityId!: 0;
  proof!: string;
  // document! : string;
  number!: string;
  issueDate!: string;
  expDate!: string;
}

export class References {
  referenceId!: 0;
  fullName!: string;
  knownForYears!: string;
  relationship!: string;
  // pincode!: 0;
  mobilenumber!: 0;
}

export class LoanModel {
  customerId!: string;
  employmentType!: string;
  empotherDetails?: string;
  employmentCategory?: string;
  salary!: string;
  yearsinEmployment!: string;
  companyName!: string;
  companyAddress!: string;
  pinCode!: 0;
  loanAmount!: string;
  repaymentMode!: string;
  loanTenure!: string;
  reference!: References[];
  identityProof!: IdentityProof
}



