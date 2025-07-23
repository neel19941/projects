export class CurrentAddress {
    address!: string;
    city!: string;
    country!: string;
    location!: string;
    landmark!: string;
    stayedOfYears!: string;
    pincode!: string;
    statecode!: string;
  }
  
  // Permanent Address Model
  export class PermanentAddress {
    address!: string;
    city!: string;
    country!: string;
    location!: string;
    landmark!: string;
    stayedOfYears!: string;
    pincode!: string;
    statecode!: string;
  }
  
export class RegisterModel {
    customerId!:string;
    firstName!: string;
    middleName!: string;
    lastName!: string;
    mobileNumber!: string;
    email!: string;
    password! : string;
    gender!: string;
    fathersOrSpousesName!: string;
    dob!: string;
    highestQualification!: string;
    adhaarNumber!: string;
    currentAddress!: CurrentAddress; 
    permanentAddress!: PermanentAddress; 
    userId!: string;
}
