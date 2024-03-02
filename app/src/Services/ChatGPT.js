import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, //just for the POC...
});

const defaultRoles = [
    {
        role: "system",
        content: "Aggregates the individual KPI analyses to compute an overall Sustainability Score, represented as a percentage (0%-100%) and a corresponding emoji. It then generates a comprehensive summary that explains how this score was derived from the KPIs, including the impact and weighting of each KPI. The system ensures that the output is structured with two attributes: 'score', 'emoji' and 'summary'."
    },
    {
        role: "assistant",
        content: "Analyzes the provided JSON input containing sustainability KPIs, calculating a preliminary score for each KPI based on its performance relative to sustainability targets. It considers the importance (weighting) of each KPI in contributing to overall environmental sustainability. The assistant synthesizes this information into a detailed analysis."
    },

    // {
    //     role: "user",
    //     content: "As a conscientious investor through a life insurance company, you prioritize the sustainability impact of your investments. You understand that your premiums are funneled into stocks, bonds, and other assets with a sustainability focus. Your primary interest lies in assessing how these investments contribute to combating global warming and enhancing social welfare. You seek clarity on the environmental and social returns of your portfolio, alongside financial performance. This system helps you gauge the sustainability impact of your investments, providing you with a score and summary that detail the environmental and social outcomes driven by your investment choices."
    // }
]

export const processKPI = async (kpi = '') => {
    const content ="Calculate sustainability output in the strict stringifyed JSON format (attributes: score, summary, emoji) for the ESG KPI list. Score: 0%-100%, Emoji represents the score: 0% -saddest, 100% - happiest. Summary - 250-300 characters. The ESG KPI list: " + JSON.stringify(kpi)
    const params = {
        messages: [
            ...defaultRoles,
            {role: "user", content},
        ],
        model: "gpt-4"
    }

    const chatCompletion = await openai.chat.completions.create(params)
    console.debug("chatCompletion.choices[0].message", chatCompletion.choices[0].message)
    return chatCompletion.choices[0].message.content;
}
