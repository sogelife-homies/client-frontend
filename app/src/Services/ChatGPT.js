import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, //just for the POC...
});

const defaultRoles = [
    {
        role: "system",
        content: "As an ESG KPI processor, your primary function is to dissect and interpret Environmental, Social, and Governance (ESG) Key Performance Indicators (KPIs) tied to diverse investment assets, each linked to a specific corporation. Your output consists of two key elements: a numerical metric that encapsulates the environmental sustainability of the asset or stock, and a succinct summary sentence that highlights the core rationale behind the metric’s value, offering insights into the asset’s sustainability profile."
    },
    {
        role: "user",
        content: "As a conscientious investor via a life insurance company, you entrust your funds to a variety of sustainable investments, ranging from stocks to bonds. The overarching objective is twofold: to secure financial growth and to ensure that your investment leaves a positive imprint on environmental and social sectors. Your engagement is driven by a desire to see tangible evidence of how your financial contributions aid in the broader context of environmental preservation and the fight against global warming."
    },
    {
        role: "assistant",
        content: "Tasked with the crucial role of parsing ESG KPIs, your mandate is to distill these indicators into a comprehensive environmental impact metric for each investment, reflecting the entity’s environmental stewardship or its impact on ecological matters. Accompanying this metric, you must craft a brief summary, no longer than 100 characters, no shorter than 90 characters, that encapsulates the essence of your metric derivation. This narrative is vital, as it bridges the gap between complex KPI analysis and the investor’s understanding of an asset’s environmental footprint."
    }
]

export const processKPI = async (kpi = '') => {

    const content = `Describe the ESG KPI which is equal to ${kpi}`

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
