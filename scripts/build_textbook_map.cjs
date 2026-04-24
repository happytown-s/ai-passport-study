const fs = require('fs');
const path = require('path');

const base = 'C:\\Users\\haro\\.openclaw\\workspace\\ai-passport-study\\src\\data';

const catTsFiles = {
  'ai_basics': 'ai-basics.ts',
  'ml_basics': 'ml-basics.ts',
  'generative_ai': 'generative-ai.ts',
  'prompt_engineering': 'prompt-engineering.ts',
  'ai_risks': 'ai-risks.ts',
  'legal': 'legal.ts',
  'business': 'business.ts',
};

const tbFiles = {
  'ai_basics': 'textbook-ai-basics.json',
  'ml_basics': 'textbook-ml-basics.json',
  'generative_ai': 'textbook-generative-ai.json',
  'prompt_engineering': 'textbook-prompt-engineering.json',
  'ai_risks': 'textbook-ai-risks.json',
  'legal': 'textbook-legal.json',
  'business': 'textbook-business.json',
};

const result = {};

for (const [cat, tsFile] of Object.entries(catTsFiles)) {
  const tbFile = tbFiles[cat];

  try {
    const mod = require(path.join(base, tsFile));
    const questions = mod.questions || mod.aiBasicsQuestions || mod.mlBasicsQuestions || mod.generativeAiQuestions || mod.promptEngineeringQuestions || mod.aiRisksQuestions || mod.legalQuestions || mod.businessQuestions || [];
    console.log(cat + ': ' + questions.length + ' questions');

    const tbData = JSON.parse(fs.readFileSync(path.join(base, tbFile), 'utf-8'));

    const tq = {};
    for (const topic of tbData) {
      tq[topic.topicId] = [];
    }

    for (const q of questions) {
      const parts = [q.question, q.explanation];
      if (q.options) {
        for (const o of q.options) parts.push(o.text);
      }
      const text = parts.join(' ').toLowerCase();

      for (const topic of tbData) {
        let score = 0;
        for (const kw of topic.keywords) {
          if (kw.length >= 2 && text.includes(kw.toLowerCase())) score++;
        }
        const titleWords = topic.title.split(/[\(\)\uff0f]/).filter(function(w) { return w.length >= 2; });
        for (const tw of titleWords) {
          if (text.includes(tw.toLowerCase())) score += 2;
        }
        if (score >= 2) {
          tq[topic.topicId].push(q.id);
        }
      }
    }

    const matched = Object.values(tq).filter(function(v) { return v.length > 0; }).length;
    console.log('  Matched ' + matched + '/' + tbData.length + ' topics');

    result[cat] = tq;
  } catch (e) {
    console.error(cat + ': Error - ' + e.message);
    result[cat] = {};
  }
}

const outPath = path.join(base, 'textbook-question-map.json');
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log('Saved to ' + outPath);

let totalTopics = 0, totalMatched = 0, totalQs = 0;
for (const cat of Object.keys(result)) {
  const topics = result[cat];
  const m = Object.values(topics).filter(function(v) { return v.length > 0; }).length;
  const qs = Object.values(topics).flat().length;
  totalTopics += Object.keys(topics).length;
  totalMatched += m;
  totalQs += qs;
}
console.log('Total: ' + totalMatched + '/' + totalTopics + ' topics, ' + totalQs + ' question links');
