import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface LibraryProject {
  name: string;
  shortDescription: string;
  overview: {
    description: string;
    whyPerfectForLibrary: string;
    targetAgeGroups: {
      group: string;
      adaptation: string;
    }[];
  };
  materials: {
    list: {
      item: string;
      quantity: string;
      source: string;
    }[];
    estimatedCost: {
      lowBudget: string;
      niceVersion: string;
    };
  };
  instructions: {
    steps: {
      stepNumber: number;
      timeEstimate: string;
      description: string;
      visualDescription: string;
    }[];
    safetyNotes: string[];
    tips: string[];
  };
  setupAndInstallation: {
    displayMethod: string;
    signageText: string;
    rules: string[];
    passiveLowMaintenanceTips: string[];
  };
  engagementPlan: {
    interactionMethod: string;
    refreshIdeas: string[];
    trackingMethods: string[];
  };
  extensions: {
    variations: string[];
    inclusiveAdaptations: string[];
  };
  marketing: {
    socialMediaPost: string;
    flyerText: string;
  };
}

export async function generateLibraryProject(projectName: string, description?: string): Promise<LibraryProject> {
  const prompt = `Generate a complete library project package for a makerspace or library program.
  Project Name: ${projectName}
  ${description ? `Context/Description: ${description}` : ""}

  Respond in JSON format following the exact structure for:
  Project Overview, Materials List, Step-by-Step Build Instructions, Setup & Installation, Engagement & Activity Plan, Extensions & Variations, and Marketing & Launch.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          shortDescription: { type: Type.STRING },
          overview: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              whyPerfectForLibrary: { type: Type.STRING },
              targetAgeGroups: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    group: { type: Type.STRING },
                    adaptation: { type: Type.STRING },
                  },
                  required: ["group", "adaptation"]
                }
              }
            },
            required: ["description", "whyPerfectForLibrary", "targetAgeGroups"]
          },
          materials: {
            type: Type.OBJECT,
            properties: {
              list: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    item: { type: Type.STRING },
                    quantity: { type: Type.STRING },
                    source: { type: Type.STRING },
                  },
                  required: ["item", "quantity", "source"]
                }
              },
              estimatedCost: {
                type: Type.OBJECT,
                properties: {
                  lowBudget: { type: Type.STRING },
                  niceVersion: { type: Type.STRING },
                },
                required: ["lowBudget", "niceVersion"]
              }
            },
            required: ["list", "estimatedCost"]
          },
          instructions: {
            type: Type.OBJECT,
            properties: {
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    timeEstimate: { type: Type.STRING },
                    description: { type: Type.STRING },
                    visualDescription: { type: Type.STRING },
                  },
                  required: ["stepNumber", "timeEstimate", "description", "visualDescription"]
                }
              },
              safetyNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["steps", "safetyNotes", "tips"]
          },
          setupAndInstallation: {
            type: Type.OBJECT,
            properties: {
              displayMethod: { type: Type.STRING },
              signageText: { type: Type.STRING },
              rules: { type: Type.ARRAY, items: { type: Type.STRING } },
              passiveLowMaintenanceTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["displayMethod", "signageText", "rules", "passiveLowMaintenanceTips"]
          },
          engagementPlan: {
            type: Type.OBJECT,
            properties: {
              interactionMethod: { type: Type.STRING },
              refreshIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
              trackingMethods: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["interactionMethod", "refreshIdeas", "trackingMethods"]
          },
          extensions: {
            type: Type.OBJECT,
            properties: {
              variations: { type: Type.ARRAY, items: { type: Type.STRING } },
              inclusiveAdaptations: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["variations", "inclusiveAdaptations"]
          },
          marketing: {
            type: Type.OBJECT,
            properties: {
              socialMediaPost: { type: Type.STRING },
              flyerText: { type: Type.STRING },
            },
            required: ["socialMediaPost", "flyerText"]
          }
        },
        required: ["name", "shortDescription", "overview", "materials", "instructions", "setupAndInstallation", "engagementPlan", "extensions", "marketing"]
      }
    }
  });

  return JSON.parse(response.text);
}
