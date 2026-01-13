export interface BaseEntity {
  id: string;
  isVisible: boolean;
}

export interface User extends BaseEntity {
  email?: string;
  password?: string;
  cui?: string;
  subscriptionId: string;
  roleId: string;
  subscription?: Subscription;
  role?: Role;
}

export interface Role extends BaseEntity {
  name: string;
  isDefault: boolean;
}

export interface Subscription extends BaseEntity {
  name: string;
  price: number;
  isDefault: boolean;
}

export interface IdentityCard extends BaseEntity {
  cnp: string;
  series: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  county: string;
  country: string;
}

export interface Use extends BaseEntity {
  userId: string;
  isSucceeded: boolean;
  identityCardId: string;
  createdAt: string; // ISO Date string
  modifiedAt: string; // ISO Date string
  user?: User;
  identityCard?: IdentityCard;
}

export interface IdentityDocumentResult {
  firstName?: string;
  firstNameConfidence?: number;
  lastName?: string;
  lastNameConfidence?: number;
  documentNumber?: string;
  documentNumberConfidence?: number;
  dateOfBirth?: string; // DateTimeOffset se serializează ca string în JSON
  dateOfBirthConfidence?: number;
  dateOfExpiration?: string;
  dateOfExpirationConfidence?: number;
  dateOfIssue?: string;
  dateOfIssueConfidence?: number;
  sex?: string;
  sexConfidence?: number;
  address?: string;
  addressConfidence?: number;
  countryRegion?: string;
  countryRegionConfidence?: number;
  region?: string;
  regionConfidence?: number;
  nationality?: string;
  nationalityConfidence?: number;
  documentType?: string;
  documentTypeConfidence?: number;
}