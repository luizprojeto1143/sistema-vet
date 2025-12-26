
export interface NuvemFiscalAuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number; // usually 3600 (1 hour)
    scope: string;
}

export interface NuvemFiscalAddress {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    codigo_municipio: string; // IBGE
    cidade?: string;
    uf: string;
    cep: string;
}

export interface NuvemFiscalPerson {
    cpf_cnpj: string;
    nome: string;
    email?: string;
    telefone?: string;
    endereco: NuvemFiscalAddress;
}

export interface NuvemFiscalServiceItem {
    codigo_servico_municipio: string; // e.g., '1.09' mapping to municipality code
    discriminacao: string;
    valor_servico: number;
    // ... complete as needed
}

export interface NuvemFiscalnfsePayload {
    ambiente: 'homologacao' | 'producao';
    referencia?: string; // our internal ID
    prestador: {
        cpf_cnpj: string;
    };
    tomador: NuvemFiscalPerson;
    servicos: NuvemFiscalServiceItem[];
}
