// utils/gemini.ts
interface GeminiRecommendation {
  violation: string;
  recommendation: {
    title: string;
    description: string;
    priority:
      | "Low Priority"
      | "Medium Priority"
      | "High Priority"
      | "Urgent Priority";
    category: string;
    estimatedImpact: string;
  };
}

function cleanGeminiResponse(raw: string): string {
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    return raw.trim();
  }

  return raw.slice(jsonStart, jsonEnd + 1).trim();
}

export async function getGeminiRecommendation(
  supplierName: string,
  riskCategory: string,
  articleSummary: string
) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  try {
    const riskTone =
      riskCategory.toLowerCase() === "high"
        ? "Use a serious and urgent tone. Recommend strong actions like audits, suspensions, or policy overhauls."
        : riskCategory.toLowerCase() === "medium"
        ? "Use a balanced tone. Recommend practical improvements like monitoring systems, internal reviews, or corrective plans."
        : "Use a light tone. Recommend low-impact actions like regular reviews, documentation improvements, or soft engagement steps.";

    const prompt = `Analyze the supplier's risk based on the information below. Respond ONLY in the strict JSON format provided, without any extra text.

Supplier: ${supplierName}
Risk Category: ${riskCategory}
Details: "${articleSummary}"

INSTRUCTION BASED ON RISK LEVEL:
${riskTone}

REQUIRED JSON OUTPUT:
{
  "violations": [
    {
      "description": "concise violation description",
      "severity": "Low" | "Medium" | "High",
      "category": "single-word label like 'Labor', 'Compliance', 'Environmental', 'Financial', 'Operational', etc."
    }
  ],
  "recommendations": [
    {
      "title": "Action title starting with a verb",
      "description": "A specific, clear one-sentence recommendation",
      "priority": "Low Priority" | "Medium Priority" | "High Priority",
      "category": "single-word theme like 'Compliance', 'Monitoring', 'Labor', 'Strategy', 'Audit', etc.",
      "estimatedImpact": "Quantified benefit like 'Reduce violations by 40%' or 'Improve delivery by 2 days'"
    }
  ]
}

RULES:
1. Use only the JSON format above — do NOT add markdown or comments.
2. ALWAYS provide 1 to 3 violations, each with a realistic category and severity.
3. ALWAYS provide EXACTLY 3 recommendations with varied, realistic priorities.
4. Vary recommendation priorities — do NOT default all to 'Low Priority'.
5. Use precise, short, business-relevant language.
6. If the input is empty or irrelevant, return 0 violations and general risk-reduction recommendations.
7. Each violation must be 1 full sentence (≥ 70 characters).`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    const result = await response.json();
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const fallbackResponse = {
      violations: [
        {
          description: "No specific violations identified",
          severity: "Medium",
        },
      ],
      recommendations: [
        {
          title: "Conduct Comprehensive Risk Assessment",
          description: "Perform detailed evaluation of all supplier operations",
          priority: "High Priority",
          category: "Assessment",
          estimatedImpact: "Identify 100% of potential risks",
        },
        {
          title: "Implement Monitoring System",
          description: "Establish regular compliance checks",
          priority: "Medium Priority",
          category: "Compliance",
          estimatedImpact: "Reduce violations by 50%",
        },
        {
          title: "Schedule Supplier Review",
          description: "Quarterly performance evaluation meetings",
          priority: "Low Priority",
          category: "Management",
          estimatedImpact: "Improve relationship by 30%",
        },
      ],
    };

    if (!rawText.trim()) return fallbackResponse;

    try {
      const cleaned = cleanGeminiResponse(
        rawText.replace(/```(json)?/g, "").trim()
      );
      const parsed = JSON.parse(cleaned);
      const validPriorities = [
        "Low Priority",
        "Medium Priority",
        "High Priority",
        "Urgent Priority",
      ];

      const riskMap = {
        high: "High Priority",
        medium: "Medium Priority",
        low: "Low Priority",
      };

      const enforcePriority = (
        geminiPriority: string,
        riskCategory: string
      ): string => {
        const riskMap = {
          high: "High Priority",
          medium: "Medium Priority",
          low: "Low Priority",
        };

        const validPriorities = [
          "Low Priority",
          "Medium Priority",
          "High Priority",
          "Urgent Priority",
        ];

        if (
          !validPriorities.includes(geminiPriority) ||
          geminiPriority === "Low Priority"
        ) {
          return (
            riskMap[riskCategory as keyof typeof riskMap] || "Medium Priority"
          );
        }

        return geminiPriority;
      };

      // Process violations (max 3)
      const finalViolations =
        Array.isArray(parsed.violations) && parsed.violations.length > 0
          ? parsed.violations.slice(0, 3).map((v: any) => ({
              description: v.description || "Unspecified violation",
              severity: ["Low", "Medium", "High"].includes(v.severity)
                ? v.severity
                : "Medium",
              category: v.category || "General",
            }))
          : fallbackResponse.violations;

      // Process recommendations (exactly 3)
      const parsedRecs = Array.isArray(parsed.recommendations)
        ? parsed.recommendations.map((r: any) => ({
            title: r.title || "Unspecified action",
            description: r.description || "No description provided",
            priority: enforcePriority(r.priority, riskCategory),
            category: r.category || "General",
            estimatedImpact: r.estimatedImpact || "Impact not estimated",
          }))
        : [];

      while (parsedRecs.length < 3) {
        parsedRecs.push(fallbackResponse.recommendations[parsedRecs.length]);
      }

      return {
        violations: finalViolations,
        recommendations: parsedRecs.slice(0, 3),
      };
    } catch (e) {
      console.error("Parsing failed. Raw Gemini response:", rawText);
      console.error("Error:", e);
      return fallbackResponse;
    }
  } catch (error) {
    console.error("API Error:", error);
    return {
      violations: [
        {
          description: "Error occurred during analysis",
          severity: "High",
        },
      ],
      recommendations: fallbackResponse.recommendations,
    };
  }
}