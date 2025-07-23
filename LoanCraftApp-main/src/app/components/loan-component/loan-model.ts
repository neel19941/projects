// Current Address Model
export class CurrentAddress {
    address!: string;
    city!: string;
    state!: string;
    country!: string;
    location!: string;
    landmark!: string;
    stayedOfYears!: number;
    pincode!: number;
    statecode!: number;
    caddressId?: number; // Optional for Current Address
  }
  
  // Permanent Address Model
  export class PermanentAddress {
    address!: string;
    city!: string;
    state!: string;
    country!: string;
    location!: string;
    landmark!: string;
    stayedOfYears!: number;
    pincode!: number;
    statecode!: number;
    paddressId?: number; // Optional for Permanent Address
  }
  
  // Banking Details Model
  export class BankingDetails {
    bankid!: number;
    accountHolder!: string;
    branchName?: string;
    accountNo!: number;
    // salary?: number;
    accountType! : string;
    dateOfOpening?: string;
    applicant?: string;
    ifscCode?: string;
    current?: string;
  }
  
  // Applicant Proof Details Model
  export class Applicant {
    proof?: string;
    document?: string;
    number!: number;
    issueDate?: string;
    expDate?: string;
  }
  
  // Loan Details Model
  export class LoanDetails {
    loanApplicantid!: number;
    purposeOfLoan?: string;
    loanAmountRequired?: number;
    tenure!: number;
    repaymentMode?: string;
    earlierLoanInBeacon?: string;
    customerId?: string;
  }
  
  // Employment Details Model
  export class EmploymentDetails {
    empid!: number;
    employmentType?: string;
    salary?: number;
    yearsinEmployment!: number;
    companyName?: string;
    companyAdrees?: string;
    pincode!: number;
    gstDetails?: string;
  }
  
  // Income Details Model
  export class IncomeDetails {
    incomeid!: number;
    applicantIncome?: number;
    otherIncome1?: number;
    otherIncome2?: number;
    otherIncome3?: number;
    totalIncome?: number;
    householdTotal?: number;
    expenditureRent?: number;
    expenditureLoan?: number;
    education?: number;
    others?: number;
    expenditureTotal?: number;
    netIncome?: number;
  }
  
  // Property Details Model
  export class PropertyDetails {
    propertyid!: number;
    ownerName?: string;
    propertyAddress?: string;
    plotArea?: number;
    builtUpArea?: number;
    buildingAge?: number;
  }
  
  // Reference Model
  export class Reference {
    referenceid!: number;
    initial?: string;
    fullName?: string;
    knownForYears?: number;
    relationship?: string;
    pincode!: number;
    mobilenumber!: number;
  }
  
  // Existing Loan Details Model
  export class ExistingLoanDetails {
    existingid!: number;
    nameOfInstitution?: string;
    purposeOfLoan?: string;
    loanAmount?: number;
    tenureOfLoan?: number;
    monthlyInstallment!: number;
    currentOutstanding?: number;
    balanceTenure?: number;
  }
export class LoanModel {
    loanId!: number;
    applicationReferenceId?: string;
    amaxnum?: string;
    title?: string;
    fullname!: string;
    fatherName?: string;
    dateOfBirth!: string;
    gender!: string;
    maritalStatus!: string;
    mailId?: string;
    higherQualification!: string;
    // noOfDependents!: number;
    category!: string;
    religion!: string;
    panCardNumber!: string;
    aadharNumber!: string;
    passportNumber?: string;
    voterIdNumber?: string;
    drivingLicenseNumber?: string;
    gstNumber?: string;
    mobileNumber!: string;
    status!: string;
    currentAddress!: CurrentAddress; // Separate model for current address
    permanentAddress!: PermanentAddress; // Separate model for permanent address
    bankingDetails!: BankingDetails;
    applicant!: Applicant[];
    detailsOfLoanAppliedFor!: LoanDetails;
    employmentDetails!: EmploymentDetails;
    incomeDetails!: IncomeDetails;
    propertyDetails!: PropertyDetails[];
    references!: Reference[];
    existingLoanDetails!: ExistingLoanDetails[];
}
