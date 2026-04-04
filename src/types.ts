export interface Contractor {
  _id?: string;
  contractor_name: string;
  contractor_address: string;
  contractor_city: string;
  contractor_state: string;
  contractor_zip: string;
  contractor_phone: string;
  contractor_email: string;
}

export interface Service {
  _id?: string;
  service_name: string;
  service_education_level: string[];
  service_rate: number;
  aliases: string[];
}