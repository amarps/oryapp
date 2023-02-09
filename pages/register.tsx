import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import Head from "next/head"
import { useRouter } from "next/router";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Layout from "../layouts/Layout";
import { AxiosError } from "axios"
import { Flow, ActionCard, CenterLink, MarginCard } from "../pkg"

import ory from "../pkg/sdk"
import { handleFlowError } from "../pkg/errors"

const Register = () => {
	const router = useRouter()


	const [flow, setFlow] = useState<RegistrationFlow>()
	// Get ?flow=... from the URL
	const { flow: flowId, return_to: returnTo } = router.query

	// In this effect we either initiate a new registration flow, or we fetch an existing registration flow.
	useEffect(() => {
		// If the router is not ready yet, or we already have a flow, do nothing.
		if (!router.isReady || flow) {
		return
		}

		// If ?flow=.. was in the URL, we fetch it
		if (flowId) {
			ory
				.getRegistrationFlow({ id: String(flowId) })
				.then(({ data }) => {
				// We received the flow - let's use its data and render the form!
				setFlow(data)
				})
				.catch(handleFlowError(router, "registration", setFlow))
			return
		}

		// Otherwise we initialize it
		ory
		.createBrowserRegistrationFlow({
			returnTo: returnTo ? String(returnTo) : undefined,
		})
		.then(({ data }) => {
			setFlow(data)
		})
		.catch(handleFlowError(router, "registration", setFlow))
	}, [flowId, router, router.isReady, returnTo, flow])


	const onSubmit = (values: UpdateRegistrationFlowBody) =>
	router
	  // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
	  // his data when she/he reloads the page.
	  .push(`/register?flow=${flow?.id}`, undefined, { shallow: true })
	  .then(() =>
		ory
		  .updateRegistrationFlow({
			flow: String(flow?.id),
			updateRegistrationFlowBody: values,
		  })
		  .then(({ data }) => {
			// If we ended up here, it means we are successfully signed up!
			//
			// You can do cool stuff here, like having access to the identity which just signed up:
			console.log("This is the user session: ", data, data.identity)

			var requestOptions = {
				method: 'POST',
				redirect: 'follow'
			  };
			  
			fetch("http://localhost:8000/register/"+ data.identity.id, requestOptions)
				.then(response => response.text())
				.then(result => console.log(result))
				.catch(error => console.log('error', error));

			// For now however we just want to redirect home!
			return router.push(flow?.return_to || "/").then(() => {})
		  })
		  .catch(handleFlowError(router, "registration", setFlow))
		  .catch((err: AxiosError) => {
			// If the previous handler did not catch the error it's most likely a form validation error
			if (err.response?.status === 400) {
			  // Yup, it is!
			  setFlow(err.response?.data)
			  return
			}

			return Promise.reject(err)
		  }),
	  )

  	return (
	<Layout>
		<Head>
        	<title>Create account - Ory NextJS Integration Example</title>
        	<meta name="description" content="NextJS + React + Vercel + Ory" />
      	</Head>
		<MarginCard>
		  	<h1 className="h3 mb-3 fw-normal">Create an account</h1>
        	<Flow onSubmit={onSubmit} flow={flow} />
		</MarginCard>
	</Layout>
  )
};
export default Register;