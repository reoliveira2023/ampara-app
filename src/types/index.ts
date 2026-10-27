export type PersonaMode = 'colaboradora' | 'contato' | 'rh' | 'transparencia';

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string; // Ex: Vizinha, Amiga, Irmã, Colega de confiança
  order: number; // 1, 2 ou 3
  accepted: boolean;
  notes?: string;
}

export interface EmergencyAudio {
  id: string;
  timestamp: string;
  durationSeconds: number;
  sha256Hash: string;
  blobUrl?: string;
  sizeBytes: number;
  status: 'encrypted' | 'verified';
}

export interface SosAlert {
  id: string;
  active: boolean;
  startedAt: string;
  location?: {
    lat: number;
    lng: number;
    accuracy: number;
    addressDescription?: string;
  };
  currentStepIndex: number; // 0 = Contato 1, 1 = Contato 2, 2 = Contato 3, 3 = Parceiro Externo
  escalationTimerSeconds: number; // segundos restantes para escalar
  stepTimeoutSeconds: number; // ex: 120s por contato
  respondedBy?: string;
  responseStatus?: 'pending' | 'in_route' | 'safe' | 'escalated' | 'cancelled';
  notes?: string;
  audioRecordings: EmergencyAudio[];
}

export interface WhiteLabelConfig {
  companyName: string;
  appPublicName: string; // Ex: "TechCorp Conecta", "Portal Sou Vale", "VivaBem Colaborador"
  appSubtitle: string; // Ex: "Portal de Benefícios, Holerite e Ponto"
  brandColor: string; // Ex: "#1e3a8a", "#047857", "#4f46e5"
  logoIcon: string; // emoji ou SVG identifier: "building" | "briefcase" | "shield" | "sparkles"
  camouflageType: 'corporate_portal' | 'notes';
}

export interface UserSecurityConfig {
  realPin: string; // ex: "7788"
  fakePin: string; // ex: "0000"
  keywordTrigger: string; // ex: "abacaxi", "socorro agora"
  isKeywordListening: boolean;
  isCamouflageActive: boolean;
  quickExitRedirectUrl: string;
  userAnonymousToken: string;
  whiteLabel: WhiteLabelConfig;
}

export interface CorporateMetrics {
  totalLicensesPurchased: number;
  activeLicensesCount: number;
  contactsConfiguredPercent: number;
  anonymizedAlertCountCurrentMonth: number;
  averageResponseTimeSeconds: number;
  kAnonymityThreshold: number; // Mínimo 20 colaboradoras para exibir dados
  isEligibleForMetrics: boolean;
}

export interface ExternalSupportPartner {
  id: string;
  name: string;
  type: 'ong' | 'central_humanizada' | 'servico_social';
  phone: string;
  operatingHours: string;
  authorizedByUser: boolean;
}
