export const asaasService = {
  getHeaders() {
    return {
      "Content-Type": "application/json",
      access_token: process.env.ASAAS_API_KEY || "",
    };
  },

  getBaseUrl() {
    return process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";
  },

  async createCustomer({ name, email, cpfCnpj, mobilePhone }: { name: string; email: string; cpfCnpj: string; mobilePhone: string }) {
    const response = await fetch(`${this.getBaseUrl()}/customers`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ name, email, cpfCnpj, mobilePhone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.errors?.[0]?.description || "Erro ao criar cliente no Asaas");
    }

    return response.json();
  },

  // Método seguro: usa token gerado client-side (PCI-DSS compliant)
  async createSubscriptionWithToken({
    customerId,
    value,
    description,
    creditCardToken,
    creditCardHolderInfo,
  }: {
    customerId: string;
    value: number;
    description: string;
    creditCardToken: string;
    creditCardHolderInfo: {
      name: string;
      email: string;
      cpfCnpj: string;
      postalCode: string;
      phone: string;
    };
  }) {
    const nextDueDate = new Date().toISOString().split("T")[0];

    const payload = {
      customer: customerId,
      billingType: "CREDIT_CARD",
      value,
      nextDueDate,
      cycle: "MONTHLY",
      description,
      creditCardToken,
      creditCardHolderInfo,
    };

    const response = await fetch(`${this.getBaseUrl()}/subscriptions`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.errors?.[0]?.description || "Erro ao criar assinatura");
    }

    return response.json();
  },

  /** @deprecated Use createSubscriptionWithToken para conformidade PCI-DSS */
  async createSubscription({
    customerId,
    value,
    description,
    creditCard,
    creditCardHolderInfo,
  }: {
    customerId: string;
    value: number;
    description: string;
    creditCard: any;
    creditCardHolderInfo: any;
  }) {
    const nextDueDate = new Date().toISOString().split("T")[0];

    const payload = {
      customer: customerId,
      billingType: "CREDIT_CARD",
      value,
      nextDueDate,
      cycle: "MONTHLY",
      description,
      creditCard,
      creditCardHolderInfo,
    };

    const response = await fetch(`${this.getBaseUrl()}/subscriptions`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.errors?.[0]?.description || "Erro ao criar assinatura");
    }

    return response.json();
  },
};

