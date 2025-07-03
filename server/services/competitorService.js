exports.generateCompetitorInsights = async (businessName, website, industry) => {
  return {
    strengths: ['Strong online presence', 'Good brand recognition'],
    weaknesses: ['Poor mobile optimization', 'Limited social proof'],
    opportunities: ['SEO improvements', 'Expand service areas'],
    threats: ['New competitors in the region', 'Negative reviews'],
    reportSummary: `The competitor ${businessName} in the ${industry} industry has a strong online brand but lacks mobile optimization and user reviews. SEO optimization and regional marketing can provide an edge.`
  };
};