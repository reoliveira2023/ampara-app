import type { 
  TrustedContact, 
  UserSecurityConfig, 
  SosAlert, 
  EmergencyAudio, 
  ExternalSupportPartner, 
  CorporateMetrics,
  WhiteLabelConfig
} from '../types';

const STORAGE_KEYS = {
  USER_CONFIG: 'ampara_user_config',
  CONTACTS: 'ampara_contacts',
  ACTIVE_ALERT: 'ampara_active_alert',
  EVIDENCES: 'ampara_evidences',
  PARTNERS: 'ampara_partners',
  CORPORATE_METRICS: 'ampara_corp_metrics',
  WHITE_LABEL: 'ampara_white_label',
};

const DEFAULT_WHITE_LABEL: WhiteLabelConfig = {
  companyName: 'TechCorp Brasil S.A.',
  appPublicName: 'TechCorp Conecta',
  appSubtitle: 'Portal de Benefícios, Holerite e Ponto Digital',
  brandColor: '#1e3a8a', // Azul corporativo
  logoIcon: 'building',
  camouflageType: 'corporate_portal',
};

const DEFAULT_USER_CONFIG: UserSecurityConfig = {
  realPin: '7788',
  fakePin: '0000',
  keywordTrigger: 'socorro agora',
  isKeywordListening: false,
  isCamouflageActive: false,
  quickExitRedirectUrl: 'https://www.google.com.br',
  userAnonymousToken: 'AMP-TOK-8842A',
  whiteLabel: DEFAULT_WHITE_LABEL,
};

const DEFAULT_CONTACTS: TrustedContact[] = [
  {
    id: 'c1',
    name: 'Mariana Silva (Vizinha)',
    phone: '(11) 98123-4567',
    relationship: 'Vizinha do mesmo andar',
    order: 1,
    accepted: true,
    notes: 'Pode bater à porta sob pretexto de pedir uma xícara de açúcar.',
  },
  {
    id: 'c2',
    name: 'Carla Oliveira (Irmã)',
    phone: '(11) 97234-5678',
    relationship: 'Irmã',
    order: 2,
    accepted: true,
    notes: 'Mora a 10 minutos de carro.',
  },
  {
    id: 'c3',
    name: 'Juliana Mendes (Amiga)',
    phone: '(11) 99345-6789',
    relationship: 'Amiga de infância',
    order: 3,
    accepted: true,
    notes: 'Tem a chave reserva da casa.',
  },
];

const DEFAULT_PARTNERS: ExternalSupportPartner[] = [
  {
    id: 'p1',
    name: 'Central Humanizada de Acolhimento 24h',
    type: 'central_humanizada',
    phone: '0800 777 0180',
    operatingHours: '24 horas / 7 dias por semana',
    authorizedByUser: true,
  },
  {
    id: 'p2',
    name: 'Rede Flor de Lótus - Apoio à Mulher',
    type: 'ong',
    phone: '(11) 3211-9988',
    operatingHours: 'Segunda a Sábado, 08h às 22h',
    authorizedByUser: false,
  },
];

const DEFAULT_CORP_METRICS: CorporateMetrics = {
  totalLicensesPurchased: 250,
  activeLicensesCount: 184,
  contactsConfiguredPercent: 88,
  anonymizedAlertCountCurrentMonth: 7,
  averageResponseTimeSeconds: 94,
  kAnonymityThreshold: 20,
  isEligibleForMetrics: true, // 184 > 20
};

export const storageService = {
  getUserConfig(): UserSecurityConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER_CONFIG, JSON.stringify(DEFAULT_USER_CONFIG));
      return DEFAULT_USER_CONFIG;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.whiteLabel) {
        parsed.whiteLabel = DEFAULT_WHITE_LABEL;
      }
      return parsed;
    } catch {
      return DEFAULT_USER_CONFIG;
    }
  },

  saveUserConfig(config: UserSecurityConfig): void {
    localStorage.setItem(STORAGE_KEYS.USER_CONFIG, JSON.stringify(config));
  },

  getWhiteLabel(): WhiteLabelConfig {
    const config = this.getUserConfig();
    return config.whiteLabel || DEFAULT_WHITE_LABEL;
  },

  saveWhiteLabel(wl: WhiteLabelConfig): void {
    const config = this.getUserConfig();
    config.whiteLabel = wl;
    this.saveUserConfig(config);
  },

  getContacts(): TrustedContact[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(DEFAULT_CONTACTS));
      return DEFAULT_CONTACTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_CONTACTS;
    }
  },

  saveContacts(contacts: TrustedContact[]): void {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  },

  getActiveAlert(): SosAlert | null {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_ALERT);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveActiveAlert(alert: SosAlert | null): void {
    if (!alert) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ALERT);
    } else {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ALERT, JSON.stringify(alert));
    }
  },

  getEvidences(): EmergencyAudio[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVIDENCES);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addEvidence(evidence: EmergencyAudio): void {
    const list = this.getEvidences();
    list.unshift(evidence);
    localStorage.setItem(STORAGE_KEYS.EVIDENCES, JSON.stringify(list));
  },

  getPartners(): ExternalSupportPartner[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PARTNERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(DEFAULT_PARTNERS));
      return DEFAULT_PARTNERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PARTNERS;
    }
  },

  savePartners(partners: ExternalSupportPartner[]): void {
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(partners));
  },

  getCorporateMetrics(): CorporateMetrics {
    const raw = localStorage.getItem(STORAGE_KEYS.CORPORATE_METRICS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CORPORATE_METRICS, JSON.stringify(DEFAULT_CORP_METRICS));
      return DEFAULT_CORP_METRICS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_CORP_METRICS;
    }
  },
};
