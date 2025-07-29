'use server';

export type CRMType = 'hubspot' | 'salesforce' | 'pipedrive' | 'none';

export interface LeadData {
  name: string;
  email: string;
  company?: string;
  website?: string;
  phone?: string;
  serviceInterest?: string;
  primaryGoal?: string;
  message?: string;
  source?: string;
  performanceScore?: number;
  analysisUrl?: string;
}

export interface CRMConfig {
  type: CRMType;
  apiKey?: string;
  apiUrl?: string;
  hubspotPortalId?: string;
  salesforceInstanceUrl?: string;
  pipedriveCompanyDomain?: string;
}

// Get CRM configuration from environment variables
function getCRMConfig(): CRMConfig {
  const crmType = (process.env.CRM_TYPE as CRMType) || 'none';
  
  return {
    type: crmType,
    apiKey: process.env.HUBSPOT_API_KEY || process.env.SALESFORCE_API_KEY || process.env.PIPEDRIVE_API_KEY,
    hubspotPortalId: process.env.HUBSPOT_PORTAL_ID,
    salesforceInstanceUrl: process.env.SALESFORCE_INSTANCE_URL,
    pipedriveCompanyDomain: process.env.PIPEDRIVE_COMPANY_DOMAIN,
  };
}

// HubSpot integration
async function submitToHubSpot(leadData: LeadData, config: CRMConfig): Promise<boolean> {
  if (!config.apiKey) {
    console.error('HubSpot API key not configured');
    return false;
  }

  try {
    const hubspotData = {
      properties: {
        email: leadData.email,
        firstname: leadData.name.split(' ')[0],
        lastname: leadData.name.split(' ').slice(1).join(' ') || '',
        company: leadData.company || '',
        website: leadData.website || '',
        phone: leadData.phone || '',
        hs_lead_status: 'NEW',
        lifecyclestage: 'lead',
        // Custom properties
        service_interest: leadData.serviceInterest || '',
        primary_goal: leadData.primaryGoal || '',
        lead_source: leadData.source || 'website_analysis',
        performance_score: leadData.performanceScore?.toString() || '',
        analysis_url: leadData.analysisUrl || '',
        message: leadData.message || '',
      },
    };

    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hubspotData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HubSpot API error:', response.status, errorText);
      return false;
    }

    console.log('Successfully submitted lead to HubSpot');
    return true;
  } catch (error) {
    console.error('HubSpot submission error:', error);
    return false;
  }
}

// Salesforce integration
async function submitToSalesforce(leadData: LeadData, config: CRMConfig): Promise<boolean> {
  if (!config.apiKey || !config.salesforceInstanceUrl) {
    console.error('Salesforce configuration incomplete');
    return false;
  }

  try {
    const salesforceData = {
      FirstName: leadData.name.split(' ')[0],
      LastName: leadData.name.split(' ').slice(1).join(' ') || 'Unknown',
      Email: leadData.email,
      Company: leadData.company || 'Unknown',
      Website: leadData.website || '',
      Phone: leadData.phone || '',
      Status: 'Open - Not Contacted',
      LeadSource: leadData.source || 'Website Analysis',
      Description: `Service Interest: ${leadData.serviceInterest || 'N/A'}\nPrimary Goal: ${leadData.primaryGoal || 'N/A'}\nPerformance Score: ${leadData.performanceScore || 'N/A'}\nMessage: ${leadData.message || 'None'}`,
    };

    const response = await fetch(`${config.salesforceInstanceUrl}/services/data/v57.0/sobjects/Lead/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(salesforceData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Salesforce API error:', response.status, errorText);
      return false;
    }

    console.log('Successfully submitted lead to Salesforce');
    return true;
  } catch (error) {
    console.error('Salesforce submission error:', error);
    return false;
  }
}

// Pipedrive integration
async function submitToPipedrive(leadData: LeadData, config: CRMConfig): Promise<boolean> {
  if (!config.apiKey || !config.pipedriveCompanyDomain) {
    console.error('Pipedrive configuration incomplete');
    return false;
  }

  try {
    // First create or find the person
    const personData = {
      name: leadData.name,
      email: [{ value: leadData.email, primary: true }],
      phone: leadData.phone ? [{ value: leadData.phone, primary: true }] : [],
    };

    const personResponse = await fetch(
      `https://${config.pipedriveCompanyDomain}.pipedrive.com/api/v1/persons?api_token=${config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personData),
      }
    );

    if (!personResponse.ok) {
      console.error('Pipedrive person creation error:', personResponse.status);
      return false;
    }

    const personResult = await personResponse.json();
    const personId = personResult.data.id;

    // Create a deal
    const dealData = {
      title: `Website Optimization - ${leadData.company || leadData.name}`,
      person_id: personId,
      status: 'open',
      stage_id: 1, // Usually the first stage, but this should be configured per Pipedrive setup
      value: 0,
      currency: 'USD',
      notes: `Service Interest: ${leadData.serviceInterest || 'N/A'}\nPrimary Goal: ${leadData.primaryGoal || 'N/A'}\nPerformance Score: ${leadData.performanceScore || 'N/A'}\nWebsite: ${leadData.website || 'N/A'}\nMessage: ${leadData.message || 'None'}`,
    };

    const dealResponse = await fetch(
      `https://${config.pipedriveCompanyDomain}.pipedrive.com/api/v1/deals?api_token=${config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
      }
    );

    if (!dealResponse.ok) {
      console.error('Pipedrive deal creation error:', dealResponse.status);
      return false;
    }

    console.log('Successfully submitted lead to Pipedrive');
    return true;
  } catch (error) {
    console.error('Pipedrive submission error:', error);
    return false;
  }
}

// Main CRM submission function
export async function submitLeadToCRM(leadData: LeadData): Promise<{ success: boolean; error?: string }> {
  const config = getCRMConfig();
  
  // Always log the submission for debugging/backup
  console.log('CRM Lead Submission:', {
    timestamp: new Date().toISOString(),
    crmType: config.type,
    leadData: {
      ...leadData,
      // Don't log sensitive data in production
      email: leadData.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
    },
  });

  if (config.type === 'none') {
    console.log('CRM integration disabled - lead logged only');
    return { success: true };
  }

  try {
    let success = false;
    
    switch (config.type) {
      case 'hubspot':
        success = await submitToHubSpot(leadData, config);
        break;
      case 'salesforce':
        success = await submitToSalesforce(leadData, config);
        break;
      case 'pipedrive':
        success = await submitToPipedrive(leadData, config);
        break;
      default:
        console.error('Unknown CRM type:', config.type);
        return { success: false, error: 'Unknown CRM type' };
    }

    return { success };
  } catch (error) {
    console.error('CRM submission failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
