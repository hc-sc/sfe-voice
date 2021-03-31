// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
  alexaSkill: {
    nlu: {
      name: 'alexa',
      lang: {
        en: [
          'en-US',
          'en-CA'
        ]
      }
    },
  },
  googleAction: {
    nlu: {
      name: 'dialogflow',
      lang: {
        en: [
          'en-US',
          'en-CA'
        ]
      }
    }
  },
  endpoint: '${JOVO_WEBHOOK_URL}',
};
