'use strict'

exports.handle = (client) => {
  // Create steps
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('app:response:name:welcome')
      client.addResponse('app:response:name:provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      })
      client.addResponse('app:response:name:provide/instructions')

      client.updateConversationState({
        helloSent: true
      })

      client.done()
    }
  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('app:response:name:apology/untrained')
      client.done()
    }
  })

	const handleGoodbye = client.createStep({
		satisfied() {
			return false
		},

		prompt() {
			client.addResponse('app:response:name:goodbye')
			client.done()
		}
	})


	const handleGreeting = client.createStep({
		satisfied() {
			return false
		},

		prompt() {
			client.addResponse('app:response:name:greeting')
			client.done()
		}
	})

  client.runFlow({
    classifications: {
      // map inbound message classifications to names of streams
		  goodbye: 'goodbye',
      greeting: 'greeting',
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
      goodbye: {
        minConfidence: 0.5
      }
    },
    streams: {
      greeting: handleGreeting,
			goodbye: handleGoodbye,
      main: 'onboarding',
      onboarding: [sayHello],
      end: [untrained],
    },
  })
}
