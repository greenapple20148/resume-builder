// supabase/functions/ai-mock-interview/index.ts
// AI Mock Interview — powered by Claude (primary) with Gemini fallback
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
const CLAUDE_API_KEY = Deno.env.get("CLAUDE_API_KEY") || "";

const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

// ── Evaluation JSON schema (shared across all modes) ──────
const EVAL_SCHEMA = `{
  "score": <1-10 overall>,
  "clarity_score": <1-10 how clear and well-structured the answer is>,
  "confidence_score": <1-10 how confident and assertive the candidate sounds>,
  "keyword_relevance": <1-10 how well the answer uses industry-relevant keywords and terminology>,
  "star_detected": <true/false whether the answer follows STAR structure>,
  "star_breakdown": {"situation": <1-10>, "task": <1-10>, "action": <1-10>, "result": <1-10>} OR null if STAR not applicable,
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["specific improvement 1", "specific improvement 2"],
  "keywords_found": ["keyword1", "keyword2"],
  "keywords_missing": ["missing_keyword1", "missing_keyword2"],
  "improved_answer": "A rewritten, stronger version of the candidate's answer that demonstrates best practices (2-4 sentences)",
  "sample_answer": "The ideal answer an expert would give (2-3 sentences)"
}`;

// ── System prompts per interview mode ──────────────────────
const SYSTEM_PROMPTS: Record<string, (role: string, difficulty: string) => string> = {
    general: (role, difficulty) => `You are an experienced interviewer at a top company conducting a ${difficulty}-level job interview for a ${role} position.

Rules:
- Ask one question at a time
- Mix technical, behavioral, and situational questions
- Calibrate difficulty to "${difficulty}" level
- Be professional but conversational

When ACTION is "generate_question":
- Return ONLY the interview question text, nothing else

When ACTION is "evaluate_answer":
- Analyze the answer for clarity, confidence, STAR structure usage, and keyword relevance to the ${role} role
- Return ONLY valid JSON in this exact format:
${EVAL_SCHEMA}

When ACTION is "generate_summary":
- Return ONLY valid JSON: {"overall_score": <1-10>, "clarity_avg": <1-10>, "confidence_avg": <1-10>, "keyword_relevance_avg": <1-10>, "star_usage_rate": "<X of Y answers used STAR>", "verdict": "Brief 1-line verdict", "top_strengths": ["s1","s2","s3"], "areas_to_improve": ["a1","a2","a3"], "recommendation": "2-3 sentence career advice"}`,

    system_design: (role, difficulty) => `You are a principal engineer conducting a ${difficulty}-level system design interview for a ${role}.

Focus areas: architecture choices, scalability, trade-offs, data modeling, API design, failure handling.

When ACTION is "generate_question":
- Ask a system design problem (e.g., "Design a URL shortener", "Design a real-time chat system")
- For follow-up questions, dig deeper into specific aspects (scaling, caching, database choice, etc.)
- Return ONLY the question text

When ACTION is "evaluate_answer":
- Evaluate on: Architecture Clarity, Scalability Thinking, Trade-off Analysis, Communication
- Also assess clarity, confidence, and technical keyword usage
- Return ONLY valid JSON:
${EVAL_SCHEMA}

When ACTION is "generate_summary":
- Return ONLY valid JSON: {"overall_score": <1-10>, "clarity_avg": <1-10>, "confidence_avg": <1-10>, "keyword_relevance_avg": <1-10>, "star_usage_rate": "N/A", "verdict": "...", "top_strengths": ["..."], "areas_to_improve": ["..."], "recommendation": "..."}`,

    behavioral: (role, difficulty) => `You are a hiring manager conducting a ${difficulty}-level behavioral interview for a ${role}.

You specifically evaluate answers using the STAR method (Situation, Task, Action, Result).

When ACTION is "generate_question":
- Ask behavioral questions starting with "Tell me about a time..." or "Describe a situation where..."
- Cover: leadership, conflict resolution, failure, teamwork, initiative, pressure
- Return ONLY the question text

When ACTION is "evaluate_answer":
- ALWAYS detect and score STAR structure. Set star_detected=true if the answer has identifiable S/T/A/R components, even if incomplete
- Score each STAR component separately in star_breakdown
- Also assess clarity, confidence, and keyword relevance
- Return ONLY valid JSON:
${EVAL_SCHEMA}

When ACTION is "generate_summary":
- Return ONLY valid JSON: {"overall_score": <1-10>, "clarity_avg": <1-10>, "confidence_avg": <1-10>, "keyword_relevance_avg": <1-10>, "star_usage_rate": "<X of Y answers used STAR>", "verdict": "...", "top_strengths": ["..."], "areas_to_improve": ["..."], "recommendation": "..."}`,

    salary: (_role, _difficulty) => `You are an HR representative / hiring manager in a salary negotiation roleplay. The candidate has received an offer and is negotiating.

Rules:
- Stay in character as the company representative
- Start with a reasonable but slightly below-market offer  
- Respond to the candidate's negotiation tactics realistically
- Push back sometimes but be open to reasonable arguments
- Consider total compensation (base, bonus, equity, benefits, PTO)

When ACTION is "generate_question":
- Present a scenario or make a statement in the negotiation (e.g., initial offer, counter-offer, pushback)
- Return ONLY the dialogue text from the company's perspective

When ACTION is "evaluate_answer":
- Evaluate the candidate's negotiation skills, confidence, clarity, and use of negotiation keywords/tactics
- Return ONLY valid JSON:
${EVAL_SCHEMA}
Additionally include: "tactics_used": ["tactic1", "tactic2"], "next_move": "What the company would say next"

When ACTION is "generate_summary":
- Return ONLY valid JSON: {"overall_score": <1-10>, "clarity_avg": <1-10>, "confidence_avg": <1-10>, "keyword_relevance_avg": <1-10>, "star_usage_rate": "N/A", "verdict": "...", "top_strengths": ["..."], "areas_to_improve": ["..."], "final_offer": "Estimated final package based on performance", "recommendation": "..."}`,

    technical: (role, difficulty) => `You are a senior engineer conducting a ${difficulty}-level technical interview for a ${role}. The focus is on the candidate's ability to EXPLAIN code, algorithms, and technical decisions clearly.

When ACTION is "generate_question":
- Present a coding problem, algorithm question, or ask the candidate to explain a technical concept
- Examples: "Explain how you would implement a LRU cache", "Walk me through the time complexity of your approach", "How does garbage collection work?"
- Return ONLY the question text

When ACTION is "evaluate_answer":
- Evaluate: Technical Accuracy, Clarity of Explanation, Complexity Analysis, Edge Case Awareness
- Also assess confidence and technical keyword usage
- Return ONLY valid JSON:
${EVAL_SCHEMA}
Additionally include: "technical_accuracy": <1-10>, "depth": <1-10>

When ACTION is "generate_summary":
- Return ONLY valid JSON: {"overall_score": <1-10>, "clarity_avg": <1-10>, "confidence_avg": <1-10>, "keyword_relevance_avg": <1-10>, "star_usage_rate": "N/A", "verdict": "...", "top_strengths": ["..."], "areas_to_improve": ["..."], "recommendation": "..."}`,
};

// ── AI call with Claude primary, Gemini fallback ─────────
async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": CLAUDE_API_KEY,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            system: systemPrompt,
            messages: [{ role: "user", content: userMessage }],
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Claude API error: ${response.status} — ${err}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || "";
}

async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: userMessage }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1500,
            },
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Gemini API error: ${response.status} — ${err}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function callAI(systemPrompt: string, userMessage: string): Promise<string> {
    // Try Claude first
    if (CLAUDE_API_KEY) {
        try {
            return await callClaude(systemPrompt, userMessage);
        } catch (err) {
            console.warn("[ai-mock-interview] Claude failed, trying Gemini:", (err as Error).message);
        }
    }
    // Fallback to Gemini
    if (GEMINI_API_KEY) {
        return await callGemini(systemPrompt, userMessage);
    }
    throw new Error("No AI provider configured. Set CLAUDE_API_KEY or GEMINI_API_KEY.");
}

// ── Main handler ──────────────────────────────────────────
Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // Auth check
        const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
        if (!authHeader) throw new Error("No auth header");

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") as string,
            Deno.env.get("SUPABASE_ANON_KEY") as string,
            { global: { headers: { Authorization: authHeader } } }
        );
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Unauthorized");

        // Admin client
        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL") as string,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
        );

        const { data: profile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError) {
            console.error("Profile fetch error:", profileError);
        }

        const plan = profile?.plan || "free";
        const sessionsUsed = profile?.mock_sessions_used ?? 0;
        const sessionsPurchased = profile?.mock_sessions_purchased ?? 0;

        // Plan limits
        const planLimits: Record<string, number> = {
            free: 0,
            pro: 0,
            premium: 3,
            career_plus: 20,
        };
        const limit = planLimits[plan] || 0;
        const totalAllowed = limit + sessionsPurchased;

        const { action, interviewType, role, difficulty, question, answer, history, questionIndex, totalQuestions } = await req.json();

        // Handle history fetch early — it doesn't need interviewType
        if (action === "get_history") {
            const { data: historyData } = await supabaseAdmin
                .from("mock_interview_history")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(20);

            return new Response(JSON.stringify({ history: historyData || [] }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Check limits only when starting a new session
        if (action === "generate_question" && questionIndex === 0) {
            if (plan === "free" || plan === "pro") {
                if (sessionsPurchased <= 0) {
                    throw new Error("MOCK_LIMIT: Mock interviews require Premium, Career+, or a Mock Pack purchase.");
                }
            } else if (plan === "premium" && sessionsUsed >= totalAllowed) {
                throw new Error("MOCK_LIMIT: You've used all 3 mock sessions this month. Upgrade to Career+ for unlimited, or purchase a Mock Pack.");
            }
        }

        const systemPrompt = SYSTEM_PROMPTS[interviewType]?.(role, difficulty || "medium");
        if (!systemPrompt) throw new Error("Invalid interview type");

        let userMessage = "";
        let result = "";

        switch (action) {
            case "generate_question": {
                const historyContext = history?.length
                    ? `\n\nPrevious questions asked (don't repeat):\n${history.map((h: any, i: number) => `${i + 1}. ${h.question}`).join("\n")}`
                    : "";
                userMessage = `ACTION: generate_question\nRole: ${role}\nDifficulty: ${difficulty || "medium"}\nQuestion ${(questionIndex || 0) + 1} of ${totalQuestions || 6}${historyContext}`;
                result = await callAI(systemPrompt, userMessage);
                break;
            }

            case "evaluate_answer": {
                userMessage = `ACTION: evaluate_answer\nRole: ${role}\nQuestion: ${question}\nCandidate's Answer: ${answer}\n\nEvaluate this answer thoroughly. Assess clarity, confidence, STAR structure, and keyword relevance. Provide an improved version of their answer. Respond with ONLY valid JSON.`;
                result = await callAI(systemPrompt, userMessage);
                break;
            }

            case "generate_summary": {
                const allQA = history?.map((h: any, i: number) =>
                    `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}\nScore: ${h.evaluation?.score || "N/A"}/10\nClarity: ${h.evaluation?.clarity_score || "N/A"}/10\nConfidence: ${h.evaluation?.confidence_score || "N/A"}/10`
                ).join("\n\n") || "";
                userMessage = `ACTION: generate_summary\nInterview type: ${interviewType}\nRole: ${role}\n\nFull interview transcript:\n${allQA}\n\nGenerate a comprehensive summary with average scores. Respond with ONLY valid JSON.`;
                result = await callAI(systemPrompt, userMessage);

                // Save session to history
                try {
                    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
                    const summaryData = JSON.parse(cleaned);

                    await supabaseAdmin.from("mock_interview_history").insert({
                        user_id: user.id,
                        interview_type: interviewType,
                        role: role,
                        difficulty: difficulty || "medium",
                        question_count: history?.length || 0,
                        overall_score: summaryData.overall_score || 0,
                        clarity_avg: summaryData.clarity_avg || 0,
                        confidence_avg: summaryData.confidence_avg || 0,
                        keyword_relevance_avg: summaryData.keyword_relevance_avg || 0,
                        star_usage_rate: summaryData.star_usage_rate || "N/A",
                        verdict: summaryData.verdict || "",
                        questions_data: JSON.stringify(history),
                        summary_data: cleaned,
                    });
                } catch (saveErr) {
                    console.error("Failed to save history:", saveErr);
                    // Don't fail the response if history save fails
                }

                // Increment session count
                if (plan === "premium") {
                    await supabaseAdmin
                        .from("profiles")
                        .update({ mock_sessions_used: sessionsUsed + 1 })
                        .eq("id", user.id);
                } else if (sessionsPurchased > 0 && (plan === "free" || plan === "pro")) {
                    await supabaseAdmin
                        .from("profiles")
                        .update({ mock_sessions_purchased: sessionsPurchased - 1 })
                        .eq("id", user.id);
                }
                break;
            }

            case "get_history": {
                const { data: historyData } = await supabaseAdmin
                    .from("mock_interview_history")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })
                    .limit(20);

                return new Response(JSON.stringify({ history: historyData || [] }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            default:
                throw new Error("Invalid action");
        }

        return new Response(JSON.stringify({ result: result.trim() }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        const msg = (error as Error).message || "Unknown error";
        return new Response(JSON.stringify({ error: msg }), {
            status: msg.startsWith("MOCK_LIMIT") ? 403 : 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
