// Mock report generator for Roast My Startup AI
// Used when OpenAI API key is not configured or in Demo Mode.

export interface StartupReport {
  verdict: string;
  roast: string;
  startupScore: number;
  strengths: string[];
  weaknesses: string[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  targetUsers: {
    persona: string;
    painPoint: string;
    willingnessToPay: string;
  }[];
  marketAnalysis: string;
  competitorRisk: string;
  revenueModel: string[];
  gtmStrategy: {
    positioning: string;
    channels: string[];
    launchPlan: string[];
  };
  mvpRoadmap: string[];
  investorReadinessScore: number;
  redFlags: string[];
  improvedIdea: string;
  sevenDayActionPlan: string[];
}

export function generateMockReport(
  idea: string,
  roastLevel: 'mild' | 'honest' | 'brutal',
  industry: string,
  stage: string
): StartupReport {
  const scoreBase = idea.length % 35 + 50; // semi-random but stable score
  const startupScore = Math.min(95, Math.max(30, scoreBase));
  const readinessScore = Math.min(10, Number(((startupScore / 10) - (roastLevel === 'brutal' ? 0.8 : 0.2)).toFixed(1)));

  const mockRoasts = {
    mild: `“It's a cute idea, really. But let's be honest: building a ${industry} solution for the ${stage} stage is like selling umbrellas in the desert. You have some neat features, but you're targeting a user base that doesn't realize they have this problem yet. The market is quiet, maybe too quiet. You'll need a lot of educational marketing to get anyone to care.”`,
    honest: `“A ${industry} startup? Bold move. You're building a wrapper around standard APIs and calling it a proprietary enterprise system. That isn't a tech company, it's a weekend project with a neat Tailwind CSS landing page. The problem is real, but your proposed solution has zero moat. The moment any major platform adds this as a minor toggle, your startup becomes a footnote.”`,
    brutal: `“Wow. Another 'game-changing' ${industry} platform. It's almost impressive how you've combined every buzzword into one pitch. This is a classic solution looking for a problem. Your target customers are already ignoring five cold emails exactly like this every morning. Building this at the ${stage} stage without verified traction is just an expensive way to learn that nobody wants what you are selling. You have no moat, high CAC, and a business model that relies on users having infinite patience.”`
  };

  return {
    verdict: startupScore > 75 
      ? "Interesting technology angle, but requires immediate value proposition narrowing to establish a defensible entry point." 
      : "High execution risk and critical moat deficiency. Recommend immediate pivot before spending capital on development.",
    roast: mockRoasts[roastLevel] || mockRoasts.honest,
    startupScore,
    strengths: [
      "Addresses a clear operational pain point that is easily articulated by targets.",
      `Highly applicable for modern workflows in the ${industry} domain.`,
      "Subscription model offers potential for recurring seat-based expansion.",
      "Regulatory barriers to entry are low, enabling quick prototype deployment."
    ],
    weaknesses: [
      "Extremely crowded vertical with high noise levels and fierce competition.",
      "Low product defensibility (heavily dependent on open APIs and common LLM wrappers).",
      "Lacks organic acquisition loops or pre-built distribution advantages.",
      "Pricing model is unvalidated; customer willingness to pay may be much lower than assumed."
    ],
    swot: {
      strengths: [
        "Lean team with fast iteration capabilities.",
        "Clear alignment with current artificial intelligence and SaaS tailwinds.",
        "Minimal infrastructure overhead required to launch MVP."
      ],
      weaknesses: [
        "High platform risk (dependent on OpenAI or other API pricing structures).",
        "Limited initial capital runway to sustain prolonged customer acquisition cycles.",
        "Lack of proprietary dataset to train custom, defensible models."
      ],
      opportunities: [
        `Expansion into highly regulated niche verticals within ${industry} currently bypassed by horizontal players.`,
        "White-labeling backend pipelines for legacy enterprise agencies.",
        "Developing proprietary browser extensions to capture workflow context directly."
      ],
      threats: [
        "Incumbents (e.g. Microsoft, Google, Salesforce) releasing native copycat features as free add-ons.",
        "Drastic reduction in public API rate limits or pricing structure changes.",
        "Rapid shift in customer focus to newer standard protocols."
      ]
    },
    targetUsers: [
      {
        persona: "Early-Stage Technical Founders",
        painPoint: "Need immediate, objective feedback on startup viability without wasting development capital.",
        willingnessToPay: "Medium ($29 - $49/mo)"
      },
      {
        persona: "Accelerator Directors & Pitch Coaches",
        painPoint: "Need to quickly filter through hundreds of low-quality applications and provide structured feedback.",
        willingnessToPay: "High ($99 - $199/mo)"
      }
    ],
    marketAnalysis: `The ${industry} sector is undergoing rapid transformation, driven by cloud adoption and AI integrations. While the Total Addressable Market (TAM) is large, the Serviceable Obtainable Market (SOM) is heavily fragmented. Startups at the ${stage} stage face steep competition from both legacy players and agile copycats. Defensibility lies in proprietary data loops, not workflow wrappers.`,
    competitorRisk: "Extremely high. Competitors can copy the core value proposition within 48 hours using open-source templates. Moat must be established via user integration hooks, custom datasets, or exclusive distribution channels.",
    revenueModel: [
      "B2B SaaS: Tiered subscription plans (Free, Starter at $29/mo, VC-ready at $99/mo).",
      "Pay-per-report: $9 per comprehensive startup roast asset.",
      "Enterprise Team License: API access and custom prompts for accelerators and funds."
    ],
    gtmStrategy: {
      positioning: `Framed as an 'AI VC Memo Generator' rather than a casual startup roaster, targeting serious founders who want to prepare for investor scrutiny.`,
      channels: [
        "Contextual posts in founder communities (Indie Hackers, YC Book, Reddit, Hacker News).",
        "Product Hunt launch coordinated with prominent launch hunters.",
        "Programmatic SEO targeting keywords like 'Startup validator', 'Investor pitch checklist'."
      ],
      launchPlan: [
        "Week 1: Conduct 15 user validation interviews with targets to refine messaging.",
        "Week 2: Deploy minimal landing page with a waitlist form to capture organic interest.",
        "Week 3: Seed case studies of roasted-and-saved startups on LinkedIn and X.",
        "Week 4: Launch publicly on Product Hunt and offer 50 free credits to the community."
      ]
    },
    mvpRoadmap: [
      "Build interactive startup submission form with roast intensity selectors.",
      "Integrate OpenAI API with structured JSON output response schema.",
      "Implement beautiful dashboard showcasing saved memos and score trends.",
      "Add interactive SWOT grid builder and downloadable PDF memo features.",
      "Integrate Supabase Auth for persistent cloud storage and sharing."
    ],
    investorReadinessScore: readinessScore,
    redFlags: [
      "Platform Moat: Zero proprietary technology; entirely dependent on standard LLM completions.",
      "CAC Risk: High customer acquisition costs relative to low initial lifetime value (LTV).",
      "Engagement: High likelihood of being treated as a 'novelty tool' with low repeat usage.",
      "Incumbent Risk: Mainstream tools can release similar features in minor product updates."
    ],
    improvedIdea: `Instead of offering a generic startup roaster, pivot the positioning to a 'Pre-Seed Investment Memo Generator'. The app will guide founders through a structured 10-minute interview, ingest their details, and output a professional-grade investment memo that they can attach to their pitch deck. This shifts the perception from 'entertainment utility' to 'essential funding preparation tool', drastically increasing customer willingness to pay.`,
    sevenDayActionPlan: [
      "Day 1: Draft the 10 core questions for the structured startup interview.",
      "Day 2: Build the landing page focusing exclusively on the 'Pre-Seed Memo' positioning.",
      "Day 3: Launch a free mini-generator on social channels to collect early user feedback.",
      "Day 4: Integrate user feedback and implement persistent user accounts.",
      "Day 5: Set up the OpenAI prompt structures and verify API response formats.",
      "Day 6: Direct target user segments from Indie Hackers to test the beta version.",
      "Day 7: Launch on Product Hunt and open paid premium tiers."
    ]
  };
}
