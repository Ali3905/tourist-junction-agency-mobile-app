interface UserData {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  gender: string;
  joining_date: string;
  created_at: string;
}
interface StudentProfileData {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  bio: string;
  university_name: string;
  graduation_year_from: string;
  profile_picture: string;
  address: string;
  city: string;
  district: string;
  pincode: string;
  state: string;
  interest_in: string[];
  hobbies: string[];
  highest_qualification: string;
  passing_year: string;
  created_at: string;
  degree_name: string;
  is_degree: boolean;
  is_diploma: boolean;
  diploma_name: string;
  is_disabled: boolean;
  resume: string;
  skills: string[];
  gender: string;
  saved_jobs_count: number;
  user: string;
}

interface Job {
  id: string;
  company_name: string;
  company_logo: string;
  job_description: string;
  job_title: string;
  location: string;
  employment_type: string;
  required_skills: string;
  salary_range: string;
  created_at: string;
  is_active: string;
  about_role: string;
  experience: string;
  role: string;
  view_count: number;
  recruiter: string;
  user: string;
  is_bookmark: boolean;
}

interface upcomingEvents {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
  remindMe: boolean;
}

interface myEvents {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
}

interface pastEvents {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
}

interface Message {
  id: number;
  name: string;
  message: string;
  messagesCount: number;
  receivedTime: string;
  image: string;
  isRead: boolean;
}



interface Content {
  id: string;
  file: string;
  author: string;
  uploaded_at: string;
}
interface Post {
  id: string;
  images: Content[];
  videos: Content[];
  profile_picture: string;
  first_name: string;
  last_name: string;
  company_name: string;
  company_logo: string;
  role: 'student' | 'company';
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_take_down: boolean;
  like_count: number;
  author: string;
}


interface ShareCardProps {
  url: string;
  onClose: () => void;
}


interface Event {
  id: string;
  company_name: string;
  name: string;
  description: string;
  location: string;
  date: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  company: string;
  student: string | null;
  attendees: any[];
  image: string;
  remindMe?: boolean;
}

interface EventsData {
  upcomingEvents: Event[];
  myEvents: Event[];
  pastEvents: Event[];
};

interface CompanyProfile {
  about_company: string | null;
  address: string | null;
  company_description: string;
  company_logo: string;
  company_name: string;
  company_size: string;
  industry: string;
  website: string;
}

interface JobDetails {
  company_profile: CompanyProfile;
  employment_type: string;
  experience: string;
  job_description: string;
  job_title: string;
  location: string;
  required_skills: string;
  role: string;
  salary_range: string;
  created_at: string;
}


interface Invoice {
  _id: string;
  vehicle: string;
  otherVehicle: string;
  customerName: string;
  mobileNumber: string;
  alternateNumber: string;
  kmStarting: string;
  perKmRateInINR: number;
  advanceAmountInINR: number;
  remainingAmountInINR: number;
  advancePlace: string;
  departurePlace: string;
  destinationPlace: string;
  departureTime: string;
  returnTime: string;
  tollInINR: number;
  otherStateTaxInINR: number;
  note: string;
  instructions: string;
  createdAt: string;
  updatedAt: string;
}

interface Vehicle {
  _id: string;
  number: string;
  seatingCapacity: number;
  model: string;
  bodyType: string;
  chassisBrand: string;
  location: string;
  contactNumber: string;
  photos: string[];
  isAC: boolean;
  isForRent: boolean;
  isForSell: boolean;
  type: string;
  noOfTyres: number;
  vehicleWeightInKGS: number;
  chassisNumber: string;
  forRentOrSell: string;
}


interface Package {
  _id: string;
  vehicle: {
    _id: string;
    number: string;
    seatingCapacity: number;
    model: string;
    bodyType: string;
    chassisBrand: string;
    location: string;
    contactNumber: string;
    photos: string[];
    isAC: boolean;
    isForRent: boolean;
    isForSell: boolean;
    type: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    PUC: string;
    RC: string;
    fitness: string;
    insurance: string;
    permit: string;
    tax: string;
    services: any[];
  };
  otherVehicle: {
    _id: string;
    number: string;
    seatingCapacity: number;
    model: string;
    bodyType: string;
    chassisBrand: string;
    location: string;
    contactNumber: string;
    photos: string[];
    isAC: boolean;
    isForRent: boolean;
    isForSell: boolean;
    type: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    PUC: string;
    RC: string;
    fitness: string;
    insurance: string;
    permit: string;
    tax: string;
    services: any[];
  };
  customerName: string;
  mobileNumber: string;
  alternateNumber: string;
  kmStarting: string;
  perKmRateInINR: number;
  advanceAmountInINR: number;
  remainingAmountInINR: number;
  advancePlace: string;
  departurePlace: string;
  destinationPlace: string;
  departureTime: string;
  returnTime: string;
  tollInINR: number;
  otherStateTaxInINR: number;
  note: string;
  instructions: string;
  createdAt: string;
  updatedAt: string;
  invoiceId: string;
  status: string;
  departureDate: string;
  returnDate: string;
  createdBy: string;
  beforeJourneyPhotos: string[];
  afterJourneyPhotos: string[];
  pickupPoint: string
}


interface Driver {
  _id: string;
  name: string;
  mobileNumber: string;
  city: string;
  state: string;
  vehicleType: string;
  photo: string;
  aadharCard: string;
  license: string;
}

interface Cleaner {
  _id: string;
  name: string;
  mobileNumber: string;
  city: string;
  state: string;
  cleanerType: string;
  photo: string;
  aadharCard: string;
}

interface DailyRoute {
  _id: string;
  vehicle: {
    number: string,
    photos: string[];
    isAC: boolean;
    isSleeper: boolean;
  };
  agencyName: string;
  departurePlace: string;
  destinationPlace: string;
  primaryDriver: Driver | null;
  secondaryDriver: Driver | null;
  cleaner: Cleaner | null;
  departureTime: string;
  instructions: string;
  status: "STARTED" | "COMPLETED";
  afterJourneyNote: string;
  beforeJourneyNote: string;
  beforeJourneyPhotos: string[];
  afterJourneyPhotos: string[];
  amenities: string[];
  arrivalTime: string | date;
  pickupPoint: string;
  dropoffPoint: string;
  ticketFare: number;
  officeAddress: string;
  phonepeNumber: string;
  mobileNumbers: string[];
  doesProvideCorierService: boolean;
  doesBookTrainTickets: boolean;
  doesCarryTwoWheelers: boolean;
  QR: string;
  seatingArrangement: string;
}


interface User {
  packageBookings: any[];
  services: any[];
  _id: string;
  userName: string;
  companyName: string;
  mobileNumber: string;
  whatsappNumber: string;
  state: string;
  city: string;
  email: string;
  password: string;
  type: string;
  drivers: any[];
  employees: any[];
  technicians: any[];
  cleaners: any[];
  vehicles: any[];
  dailyRoutes: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
