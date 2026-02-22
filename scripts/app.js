class CPCFAQGenerator {
    constructor() {
        this.faqDatabase = [];
        this.currentTopic = 'all';
        this.init();
    }

    async init() {
        await this.loadFAQDatabase();
        this.setupEventListeners();
    }

    async loadFAQDatabase() {
        try {
            const response = await fetch('data/cpc-faqs.json');
            this.faqDatabase = await response.json();
        } catch (error) {
            console.error('Error loading FAQ database:', error);
            this.loadSampleData();
        }
    }

    loadSampleData() {
        this.faqDatabase = [
            {
                question: "What is the limitation period for filing a suit for recovery of money?",
                answer: "Under Article 55 of the Limitation Act, 1963, the limitation period for a suit for money recoverable by virtue of a contract is 3 years from the date when the right to receive the money accrues.",
                topic: "limitation",
                section: "Article 55",
                keywords: ["money recovery", "contract", "limitation", "3 years"]
            },
            {
                question: "When can a court refuse to grant adjournment?",
                answer: "Under Order XVII Rule 1, a court may refuse adjournment if: 1) It's sought for dilatory purposes, 2) Adequate cause is not shown, 3) It would cause undue delay, 4) The party seeking adjournment has been negligent.",
                topic: "procedure",
                section: "Order XVII Rule 1",
                keywords: ["adjournment", "refusal", "dilatory", "delay"]
            }
        ];
    }

    setupEventListeners() {
        document.getElementById('mainSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.intelligentSearch();
        });
    }

    intelligentSearch() {
        const query = document.getElementById('mainSearch').value.toLowerCase();
        const results = this.faqDatabase.filter(faq => 
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query) ||
            faq.keywords.some(k => k.toLowerCase().includes(query))
        );
        
        this.displayResults(results);
    }

    loadTopic(topic) {
        this.currentTopic = topic;
        const results = this.faqDatabase.filter(faq => faq.topic === topic);
        this.displayResults(results);
    }

    displayResults(faqs) {
        const container = document.getElementById('faq-display');
        
        if (faqs.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>No results found</h3>
                    <p>Try the AI Generator to create new FAQs for your query!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <h3>Found ${faqs.length} relevant FAQ(s)</h3>
            <div class="results-container">
                ${faqs.map((faq, index) => `
                    <div class="faq-card" onclick="this.classList.toggle('expanded')">
                        <div class="faq-header">
                            <h4>${faq.question}</h4>
                            <span class="section-ref">${faq.section || ''}</span>
                        </div>
                        <div class="faq-content">
                            <p>${faq.answer}</p>
                            <div class="keywords">
                                ${faq.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async generateAIFAQ() {
        const topic = document.getElementById('topicInput').value;
        if (!topic.trim()) {
            alert('Please enter a topic or question first!');
            return;
        }

        // Simulate AI generation (replace with actual AI API call)
        const generatedFAQ = await this.simulateAIGeneration(topic);
        this.displayGeneratedFAQ(generatedFAQ);
    }

    async simulateAIGeneration(topic) {
        // This would be replaced with actual OpenAI API call
        return {
            questions: [
                `What are the key provisions related to ${topic}?`,
                `How does ${topic} affect civil procedure?`,
                `What are the exceptions to ${topic} in CPC?`
            ],
            answers: [
                `The key provisions related to ${topic} are outlined in specific sections of the CPC...`,
                `${topic} affects civil procedure by establishing guidelines for...`,
                `The main exceptions to ${topic} include situations where...`
            ]
        };
    }

    displayGeneratedFAQ(generated) {
        const container = document.getElementById('faq-display');
        container.innerHTML = `
            <div class="ai-generated">
                <h3>🤖 AI-Generated FAQs</h3>
                ${generated.questions.map((q, i) => `
                    <div class="generated-faq">
                        <h4>${q}</h4>
                        <p>${generated.answers[i]}</p>
                        <button onclick="this.parentElement.remove()">Remove</button>
                        <button onclick="saveFAQ('${q}', '${generated.answers[i]}')">Save to Database</button>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Initialize the application
const faqApp = new CPCFAQGenerator();

// Global functions
function intelligentSearch() {
    faqApp.intelligentSearch();
}

function loadTopic(topic) {
    faqApp.loadTopic(topic);
}

function generateAIFAQ() {
    faqApp.generateAIFAQ();
}

function saveFAQ(question, answer) {
    // Save to database functionality
    alert('FAQ saved to database!');
}
