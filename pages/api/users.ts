import { NextApiRequest, NextApiResponse } from "next"

import nookies from "nookies"

import * as t from "io-ts"

import { prisma } from "utils/server/prisma"
import { hexPattern } from "utils/hexPattern"
import { userProps } from "utils/types"
// import { zkChatTwitterHandle } from "utils/verification"



export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== "POST") {
		return res.status(400).end()
	}

	const { publicKey } = req.query
	console.log("creating user with public key", publicKey)
	if (typeof publicKey !== "string" || !hexPattern.test(publicKey)) {
		return res.status(400).end()
	}

	// console.error("looking for verification tweet...")

	// const query = encodeURIComponent(`@${zkChatTwitterHandle} "${publicKey}"`)
	// console.error("query", query);
	// const twitterApiResponse = await fetch(
	// 	`https://api.twitter.com/2/tweets/search/recent?query=${query}&expansions=author_id&user.fields=username,profile_image_url`,
	// 	{
	// 		headers: {
	// 			"User-Agent": "v2RecentSearchJS",
	// 			Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
	// 		},
	// 	}
	// )
    
	// not work.
	// console.log("got twitter api response with status", twitterApiResponse.status)
	// console.log("Twitter API Response:", await twitterApiResponse.text());

	// if (twitterApiResponse.status !== 200) {
	// 	return res.status(500).end()
	// }

	// const data = await twitterApiResponse.json()



	// const [{ id: verificationTweetId, author_id: twitterId }] = data.data

	// const { username: twitterHandle, profile_image_url: twitterProfileImage } =
	// 	data.includes.users.find((user) => user.id === twitterId)!

	await prisma.user
		.create({
			data: {
				publicKey,
				twitterId: publicKey,// twitterId,
				twitterHandle: publicKey,// twitterHandle,
				verificationTweetId: "",// verificationTweetId,
				twitterProfileImage: "https://pbs.twimg.com/profile_images/1721702583302266880/fmWbM4RN_400x400.jpg"// twitterProfileImage,
			},
			select: userProps,
		})
		.then((user) => {
			nookies.set({ res }, "publicKey", publicKey, {
				maxAge: 30 * 24 * 60 * 60,
				path: "/",
				httpOnly: true,
			})
			res.status(200).json(user)
		})
		.catch((err) => {
			console.error(err)
			console.error("Error creating user:", err)
			res.status(500).end()
		})
}






// import { NextApiRequest, NextApiResponse } from "next"

// import nookies from "nookies"

// import * as t from "io-ts"

// import { prisma } from "utils/server/prisma"
// import { hexPattern } from "utils/hexPattern"
// import { userProps } from "utils/types"
// import { zkChatTwitterHandle } from "utils/verification"

// const twitterSearchResult = t.type({
// 	meta: t.type({
// 		newest_id: t.string,
// 		oldest_id: t.string,
// 		result_count: t.number,
// 	}),
// 	includes: t.type({
// 		users: t.array(
// 			t.type({
// 				id: t.string,
// 				name: t.string,
// 				username: t.string,
// 				profile_image_url: t.string,
// 			})
// 		),
// 	}),
// 	data: t.array(
// 		t.type({
// 			author_id: t.string,
// 			id: t.string,
// 			text: t.string,
// 		})
// 	),
// })

// export default async (req: NextApiRequest, res: NextApiResponse) => {
// 	if (req.method !== "POST") {
// 		return res.status(400).end()
// 	}

// 	const { publicKey } = req.query
// 	console.log("creating user with public key", publicKey)
// 	if (typeof publicKey !== "string" || !hexPattern.test(publicKey)) {
// 		return res.status(400).end()
// 	}

// 	console.log("looking for verification tweet...")

// 	const query = encodeURIComponent(`@${zkChatTwitterHandle} "${publicKey}"`)
// 	const twitterApiResponse = await fetch(
// 		`https://api.twitter.com/2/tweets/search/recent?query=${query}&expansions=author_id&user.fields=username,profile_image_url`,
// 		{
// 			headers: {
// 				Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
// 			},
// 		}
// 	)

// 	console.log("got twitter api response with status", twitterApiResponse.status)

// 	if (twitterApiResponse.status !== 200) {
// 		return res.status(500).end()
// 	}

// 	const data = await twitterApiResponse.json()

// 	if (!twitterSearchResult.is(data) || data.meta.result_count < 1) {
// 		console.error("couldn't find verification tweet", data)
// 		return res.status(500).end()
// 	}

// 	const [{ id: verificationTweetId, author_id: twitterId }] = data.data

// 	const { username: twitterHandle, profile_image_url: twitterProfileImage } =
// 		data.includes.users.find((user) => user.id === twitterId)!

// 	await prisma.user
// 		.create({
// 			data: {
// 				publicKey,
// 				twitterId,
// 				twitterHandle,
// 				verificationTweetId,
// 				twitterProfileImage,
// 			},
// 			select: userProps,
// 		})
// 		.then((user) => {
// 			nookies.set({ res }, "publicKey", publicKey, {
// 				maxAge: 30 * 24 * 60 * 60,
// 				path: "/",
// 				httpOnly: true,
// 			})
// 			res.status(200).json(user)
// 		})
// 		.catch((err) => {
// 			console.error(err)
// 			res.status(500).end()
// 		})
// }
