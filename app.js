// ================================
// SUPABASE CONFIG
// ================================
console.log("App JS Loaded Successfully");
const supabaseUrl = "https://iihkigsabrgzfyjmbpen.supabase.co";
const supabaseKey = "sb_publishable_UsrPyMoH5mhSG9pd5R5ksg_krkLH6OK";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ================================
// LOAD EXISTING FAQS FROM DATABASE
// ================================

async function loadFAQs() {

    const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("Load Error:", error);
        return;
    }

    const container = document.getElementById("faq-container");
    container.innerHTML = "";

    data.forEach(faq => {
        container.innerHTML += `
            <div style="background:#f4f4f4; padding:15px; margin:10px 0; border-radius:8px;">
                <h4>${faq.question}</h4>
                <p>${faq.answer}</p>
            </div>
        `;
    });
}

// ================================
// SIMPLE AI GENERATOR (CLIENT SIDE)
// ================================

function generateSimpleAI(topic) {

    const question = `What is the legal position regarding ${topic} under CPC?`;

    const answer = `
Under the Civil Procedure Code, ${topic} is governed by relevant procedural provisions.
The court follows statutory timelines and judicial precedents.
Proper compliance ensures procedural fairness and justice.
    `;

    return { question, answer };
}

// ================================
// SAVE FAQ TO SUPABASE
// ================================

async function saveFAQ(questionText, answerText) {

    const { error } = await supabase
        .from("faqs")
        .insert([
            {
                question: questionText,
                answer: answerText
            }
        ]);

    if (error) {
        console.error("Insert Error:", error);
        alert("Error saving FAQ. Check console.");
    } else {
        alert("FAQ saved successfully!");
        loadFAQs();
    }
}

// ================================
// MAIN GENERATE FUNCTION
// ================================

async function generateAIFAQ() {

    const topic = document.getElementById("topicInput").value;

    if (!topic) {
        alert("Please enter a topic.");
        return;
    }

    const aiResult = generateSimpleAI(topic);

    await saveFAQ(aiResult.question, aiResult.answer);

    document.getElementById("topicInput").value = "";
}

// ================================
// AUTO LOAD ON PAGE START
// ================================

document.addEventListener("DOMContentLoaded", loadFAQs);
