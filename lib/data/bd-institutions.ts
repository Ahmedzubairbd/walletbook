export interface BDInstitution {
  id: string;
  name: string;
  shortName: string;
  type: "bank" | "mfs" | "card_network";
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  category?: string;
}

export const BD_BANKS: BDInstitution[] = [
  // State Banks
  { id: "sonali", name: "Sonali Bank", shortName: "Sonali", type: "bank", primaryColor: "#1a5276", secondaryColor: "#2e86c1", textColor: "#ffffff", category: "State Bank" },
  { id: "janata", name: "Janata Bank", shortName: "Janata", type: "bank", primaryColor: "#1e8449", secondaryColor: "#27ae60", textColor: "#ffffff", category: "State Bank" },
  { id: "agrani", name: "Agrani Bank", shortName: "Agrani", type: "bank", primaryColor: "#1a5276", secondaryColor: "#5dade2", textColor: "#ffffff", category: "State Bank" },
  { id: "rupali", name: "Rupali Bank", shortName: "Rupali", type: "bank", primaryColor: "#922b21", secondaryColor: "#e74c3c", textColor: "#ffffff", category: "State Bank" },
  { id: "bdbl", name: "Bangladesh Development Bank", shortName: "BDBL", type: "bank", primaryColor: "#154360", secondaryColor: "#1a5276", textColor: "#ffffff", category: "State Bank" },
  { id: "basic", name: "BASIC Bank", shortName: "BASIC", type: "bank", primaryColor: "#1a3a6c", secondaryColor: "#2471a3", textColor: "#ffffff", category: "State Bank" },
  // Private Banks
  { id: "dbbl", name: "Dutch-Bangla Bank", shortName: "DBBL", type: "bank", primaryColor: "#e67e22", secondaryColor: "#f39c12", textColor: "#ffffff", category: "Private Bank" },
  { id: "brac", name: "BRAC Bank", shortName: "BRAC", type: "bank", primaryColor: "#1e6823", secondaryColor: "#27ae60", textColor: "#ffffff", category: "Private Bank" },
  { id: "city", name: "City Bank", shortName: "City", type: "bank", primaryColor: "#1a3a6c", secondaryColor: "#2e86c1", textColor: "#ffffff", category: "Private Bank" },
  { id: "ebl", name: "Eastern Bank (EBL)", shortName: "EBL", type: "bank", primaryColor: "#4a235a", secondaryColor: "#8e44ad", textColor: "#ffffff", category: "Private Bank" },
  { id: "prime", name: "Prime Bank", shortName: "Prime", type: "bank", primaryColor: "#922b21", secondaryColor: "#e74c3c", textColor: "#ffffff", category: "Private Bank" },
  { id: "pubali", name: "Pubali Bank", shortName: "Pubali", type: "bank", primaryColor: "#e67e22", secondaryColor: "#f39c12", textColor: "#ffffff", category: "Private Bank" },
  { id: "ab", name: "AB Bank", shortName: "AB", type: "bank", primaryColor: "#1f618d", secondaryColor: "#2e86c1", textColor: "#ffffff", category: "Private Bank" },
  { id: "mtb", name: "Mutual Trust Bank", shortName: "MTB", type: "bank", primaryColor: "#0e6655", secondaryColor: "#17a589", textColor: "#ffffff", category: "Private Bank" },
  { id: "dhaka", name: "Dhaka Bank", shortName: "Dhaka", type: "bank", primaryColor: "#1a3a6c", secondaryColor: "#154360", textColor: "#ffffff", category: "Private Bank" },
  { id: "southeast", name: "Southeast Bank", shortName: "SEB", type: "bank", primaryColor: "#1a3a6c", secondaryColor: "#2874a6", textColor: "#ffffff", category: "Private Bank" },
  { id: "national", name: "National Bank", shortName: "NBL", type: "bank", primaryColor: "#1e6823", secondaryColor: "#239b56", textColor: "#ffffff", category: "Private Bank" },
  { id: "mercantile", name: "Mercantile Bank", shortName: "MBL", type: "bank", primaryColor: "#1a5276", secondaryColor: "#2980b9", textColor: "#ffffff", category: "Private Bank" },
  { id: "ucbl", name: "United Commercial Bank", shortName: "UCBL", type: "bank", primaryColor: "#922b21", secondaryColor: "#a93226", textColor: "#ffffff", category: "Private Bank" },
  { id: "nrb", name: "NRB Bank", shortName: "NRB", type: "bank", primaryColor: "#1f618d", secondaryColor: "#2471a3", textColor: "#ffffff", category: "Private Bank" },
  { id: "bank_asia", name: "Bank Asia", shortName: "Asia", type: "bank", primaryColor: "#4a235a", secondaryColor: "#7d3c98", textColor: "#ffffff", category: "Private Bank" },
  { id: "trust", name: "Trust Bank", shortName: "Trust", type: "bank", primaryColor: "#1a3a6c", secondaryColor: "#1f618d", textColor: "#ffffff", category: "Private Bank" },
  { id: "one_bank", name: "One Bank", shortName: "One", type: "bank", primaryColor: "#0e6655", secondaryColor: "#148f77", textColor: "#ffffff", category: "Private Bank" },
  { id: "premier", name: "Premier Bank", shortName: "Premier", type: "bank", primaryColor: "#1a5276", secondaryColor: "#21618c", textColor: "#ffffff", category: "Private Bank" },
  { id: "ific", name: "IFIC Bank", shortName: "IFIC", type: "bank", primaryColor: "#154360", secondaryColor: "#1a5276", textColor: "#ffffff", category: "Private Bank" },
  { id: "bbl", name: "Bengal Commercial Bank", shortName: "BBL", type: "bank", primaryColor: "#1a3a6c", secondaryColor: "#2471a3", textColor: "#ffffff", category: "Private Bank" },
  { id: "ncc", name: "NCC Bank", shortName: "NCC", type: "bank", primaryColor: "#0e6655", secondaryColor: "#1abc9c", textColor: "#ffffff", category: "Private Bank" },
  { id: "jamuna", name: "Jamuna Bank", shortName: "Jamuna", type: "bank", primaryColor: "#1a5276", secondaryColor: "#2980b9", textColor: "#ffffff", category: "Private Bank" },
  { id: "padma", name: "Padma Bank", shortName: "Padma", type: "bank", primaryColor: "#922b21", secondaryColor: "#c0392b", textColor: "#ffffff", category: "Private Bank" },
  { id: "community", name: "Community Bank", shortName: "CBB", type: "bank", primaryColor: "#1e6823", secondaryColor: "#229954", textColor: "#ffffff", category: "Private Bank" },
  // Islamic Banks
  { id: "islami", name: "Islami Bank Bangladesh", shortName: "IBBL", type: "bank", primaryColor: "#1a5276", secondaryColor: "#2e86ab", textColor: "#ffffff", category: "Islamic Bank" },
  { id: "sibl", name: "Social Islami Bank", shortName: "SIBL", type: "bank", primaryColor: "#1a6b3a", secondaryColor: "#1e8449", textColor: "#ffffff", category: "Islamic Bank" },
  { id: "shahjalal", name: "Shahjalal Islami Bank", shortName: "SJIBL", type: "bank", primaryColor: "#1a6b3a", secondaryColor: "#1d8348", textColor: "#ffffff", category: "Islamic Bank" },
  { id: "al_arafah", name: "Al-Arafah Islami Bank", shortName: "AIBL", type: "bank", primaryColor: "#17717a", secondaryColor: "#148f77", textColor: "#ffffff", category: "Islamic Bank" },
  { id: "exim", name: "EXIM Bank", shortName: "EXIM", type: "bank", primaryColor: "#922b21", secondaryColor: "#cb4335", textColor: "#ffffff", category: "Islamic Bank" },
  { id: "first_security", name: "First Security Islami Bank", shortName: "FSIB", type: "bank", primaryColor: "#1a5276", secondaryColor: "#1f618d", textColor: "#ffffff", category: "Islamic Bank" },
  { id: "union", name: "Union Bank", shortName: "Union", type: "bank", primaryColor: "#0e6655", secondaryColor: "#17a589", textColor: "#ffffff", category: "Islamic Bank" },
  { id: "global_islami", name: "Global Islami Bank", shortName: "GIB", type: "bank", primaryColor: "#154360", secondaryColor: "#1a5276", textColor: "#ffffff", category: "Islamic Bank" },
  // Foreign Banks
  { id: "standard_chartered", name: "Standard Chartered Bangladesh", shortName: "SCB", type: "bank", primaryColor: "#00857c", secondaryColor: "#00a89d", textColor: "#ffffff", category: "Foreign Bank" },
  { id: "hsbc", name: "HSBC Bangladesh", shortName: "HSBC", type: "bank", primaryColor: "#db0011", secondaryColor: "#e8001a", textColor: "#ffffff", category: "Foreign Bank" },
  { id: "citi", name: "Citibank Bangladesh", shortName: "Citi", type: "bank", primaryColor: "#003b70", secondaryColor: "#0051a5", textColor: "#ffffff", category: "Foreign Bank" },
  { id: "woori", name: "Woori Bank Bangladesh", shortName: "Woori", type: "bank", primaryColor: "#003087", secondaryColor: "#0041b3", textColor: "#ffffff", category: "Foreign Bank" },
  { id: "state_bank_india", name: "State Bank of India (BD)", shortName: "SBI", type: "bank", primaryColor: "#1a3a6c", secondaryColor: "#2874a6", textColor: "#ffffff", category: "Foreign Bank" },
];

export const BD_MFS: BDInstitution[] = [
  { id: "bkash", name: "bKash", shortName: "bKash", type: "mfs", primaryColor: "#e2136e", secondaryColor: "#b01459", textColor: "#ffffff" },
  { id: "nagad", name: "Nagad", shortName: "Nagad", type: "mfs", primaryColor: "#f04e23", secondaryColor: "#d14320", textColor: "#ffffff" },
  { id: "rocket", name: "Rocket (DBBL)", shortName: "Rocket", type: "mfs", primaryColor: "#7b2d8b", secondaryColor: "#6a1a7c", textColor: "#ffffff" },
  { id: "surecash", name: "SureCash", shortName: "SureCash", type: "mfs", primaryColor: "#0072bc", secondaryColor: "#0063a5", textColor: "#ffffff" },
  { id: "upay", name: "Upay", shortName: "Upay", type: "mfs", primaryColor: "#2ca84e", secondaryColor: "#239b46", textColor: "#ffffff" },
  { id: "mycash", name: "MYCash", shortName: "MYCash", type: "mfs", primaryColor: "#e67e22", secondaryColor: "#d35400", textColor: "#ffffff" },
  { id: "ok_wallet", name: "OK Wallet", shortName: "OK", type: "mfs", primaryColor: "#1a5276", secondaryColor: "#154360", textColor: "#ffffff" },
  { id: "tap", name: "Tap", shortName: "Tap", type: "mfs", primaryColor: "#922b21", secondaryColor: "#7b241c", textColor: "#ffffff" },
  { id: "islami_wallet", name: "Islami Wallet", shortName: "iWallet", type: "mfs", primaryColor: "#1a5276", secondaryColor: "#2e86ab", textColor: "#ffffff" },
  { id: "cellfin", name: "CellFin", shortName: "CellFin", type: "mfs", primaryColor: "#0e6655", secondaryColor: "#148f77", textColor: "#ffffff" },
];

export const CARD_NETWORKS: BDInstitution[] = [
  { id: "visa", name: "Visa", shortName: "VISA", type: "card_network", primaryColor: "#1a1f71", secondaryColor: "#f7b731", textColor: "#ffffff" },
  { id: "mastercard", name: "Mastercard", shortName: "MC", type: "card_network", primaryColor: "#eb001b", secondaryColor: "#f79e1b", textColor: "#ffffff" },
  { id: "amex", name: "American Express", shortName: "AMEX", type: "card_network", primaryColor: "#007bc1", secondaryColor: "#00a4e0", textColor: "#ffffff" },
  { id: "unionpay", name: "UnionPay", shortName: "UP", type: "card_network", primaryColor: "#c0392b", secondaryColor: "#e74c3c", textColor: "#ffffff" },
];

export const ALL_INSTITUTIONS: BDInstitution[] = [...BD_BANKS, ...BD_MFS, ...CARD_NETWORKS];

export function getInstitutionById(id: string): BDInstitution | undefined {
  return ALL_INSTITUTIONS.find((inst) => inst.id === id);
}
