const axios = require('axios');
require('dotenv').config()
const { handleProd, handlePrice } = require('./products')
const { getUserVID, deleteAssociation, getAssociation, createUser, getContactDeals, getDealData, createDeal, getHubspotProducts, createProduct, handleStatus, createLineItem, createAssociation, updateDeal, associateContactToDeal, createUserOptIn, updateContact } = require('./hubspot')

// const stripe = require('stripe')(process.env.STRIPE_PROD_SK);  // FOR PROD
const stripe = require('stripe')(process.env.STRIPE_TEST_SK); // FOR DEV


// const manualAdd = async (customerId, product, productPriceId) => {
//     const priceObj = handlePrice(productPriceId)
//     const status = "Active"
//     // const status = "canceled"
//     const prodInfo = handleProd(product)
//     const customer = await stripe.customers.retrieve(customerId);
//     const email = customer.email
//     let name = customer.metadata.name || customer.name || customer.shipping.name
//     let newStatus = handleStatus(status)

//     try {
//         let userId = await getUserVID(email)
//         if (!userId) {
//             userId = await createUser(email, name)
//         }
//         const deals = await getContactDeals(userId)
//         if (deals && deals.length > 0) {
//             let dealsWithData = await Promise.all(deals.map(async (deal) => {
//                 return await getDealData(deal)
//             }))
//             dealsWithData = dealsWithData.filter((deal) => {
//                 return deal.properties.pipeline && deal.properties.pipeline === '6808662'
//             })
//             if (prodInfo.prod === "Authorify") {
//                 const match = dealsWithData.find((ele) => {
//                     return ele.properties.authorify_product && ele.properties.authorify_product !== null
//                 })
//                 if (match) {
//                     if (status === "trialing") {
//                         return
//                     } else {
//                         const body = {
//                             properties: {
//                                 "dealname": `${name} - ${priceObj.name}`,
//                                 "status": newStatus
//                             }
//                         }
//                         body.properties[priceObj.productProperty] = priceObj.product
//                         body.properties[priceObj.priceProperty] = priceObj.value
//                         await updateDeal(match.id, body)
//                         const associations = await getAssociation(match.id)
//                         await Promise.all(associations.map(async (association) => {
//                             await deleteAssociation(match.id, association)
//                         }))
//                         const hubspotProducts = await getHubspotProducts([])
//                         const productMatch = hubspotProducts.find((item) => {
//                             return item.properties.name && item.properties.name === priceObj.name
//                         })
//                         if (productMatch) {
//                             const lineItemId = await createLineItem(priceObj.name, productMatch.id)
//                             await createAssociation(match.id, lineItemId)
//                         } else {
//                             console.log("NO PROD MATCH", priceObj.name);
//                             const productId = await createProduct(priceObj)
//                             const lineItemId = await createLineItem(priceObj.name, productId)
//                             await createAssociation(match.id, lineItemId)
//                         }
//                     }
//                     return
//                 } else {
//                     const dealId = await createDeal(priceObj, name, status)
//                     await associateContactToDeal(dealId, userId)
//                     const hubspotProducts = await getHubspotProducts([])
//                     const productMatch = hubspotProducts.find((item) => {
//                         return item.properties.name && item.properties.name === priceObj.name
//                     })
//                     if (productMatch) {
//                         const lineItemId = await createLineItem(priceObj.name, productMatch.id)
//                         await createAssociation(dealId, lineItemId)
//                     } else {
//                         const productId = await createProduct(priceObj)
//                         const lineItemId = await createLineItem(priceObj.name, productId)
//                         await createAssociation(dealId, lineItemId)
//                     }
//                 }
//             } else if (prodInfo.prod === "RMA") {
//                 const match = dealsWithData.find((ele) => {
//                     return ele.properties.referral_marketing_product && ele.properties.referral_marketing_product !== null
//                 })
//                 if (match) {
//                     if (status === "trialing") {
//                         return
//                     } else {
//                         const body = {
//                             properties: {
//                                 "dealname": `${name} - ${priceObj.name}`,
//                                 "status": newStatus
//                             }
//                         }
//                         body.properties[priceObj.productProperty] = priceObj.product
//                         body.properties[priceObj.priceProperty] = priceObj.value
//                         await updateDeal(match.id, body)
//                         const associations = await getAssociation(match.id)
//                         await Promise.all(associations.map(async (association) => {
//                             await deleteAssociation(match.id, association)
//                         }))
//                         const hubspotProducts = await getHubspotProducts([])
//                         const productMatch = hubspotProducts.find((item) => {
//                             return item.properties.name && item.properties.name === priceObj.name
//                         })
//                         if (productMatch) {
//                             const lineItemId = await createLineItem(priceObj.name, productMatch.id)
//                             await createAssociation(match.id, lineItemId)
//                         } else {
//                             const productId = await createProduct(priceObj)
//                             const lineItemId = await createLineItem(priceObj.name, productId)
//                             await createAssociation(match.id, lineItemId)
//                         }
//                     }
//                     return
//                 } else {
//                     const dealId = await createDeal(priceObj, name, status)
//                     await associateContactToDeal(dealId, userId)
//                     const hubspotProducts = await getHubspotProducts([])
//                     const productMatch = hubspotProducts.find((item) => {
//                         return item.properties.name && item.properties.name === priceObj.name
//                     })
//                     if (productMatch) {
//                         const lineItemId = await createLineItem(priceObj.name, productMatch.id)
//                         await createAssociation(dealId, lineItemId)
//                     } else {
//                         const productId = await createProduct(priceObj)
//                         const lineItemId = await createLineItem(priceObj.name, productId)
//                         await createAssociation(dealId, lineItemId)
//                     }
//                 }
//             } else if (prodInfo.prod === "DFY") {
//                 const match = dealsWithData.find((ele) => {
//                     return ele.properties && ele.properties.dfy_product_name && ele.properties.dfy_product_name !== null
//                 })
//                 if (match) {
//                     if (status === "trialing") {
//                         return
//                     } else {
//                         const body = {
//                             properties: {
//                                 "dealname": `${name} - ${priceObj.name}`,
//                                 "status": newStatus
//                             }
//                         }
//                         body.properties[priceObj.productProperty] = priceObj.product
//                         body.properties[priceObj.priceProperty] = priceObj.value
//                         await updateDeal(match.id, body)
//                         const associations = await getAssociation(match.id)
//                         await Promise.all(associations.map(async (association) => {
//                             await deleteAssociation(match.id, association)
//                         }))
//                         const hubspotProducts = await getHubspotProducts([])
//                         const productMatch = hubspotProducts.find((item) => {
//                             return item.properties.name && item.properties.name === priceObj.name
//                         })
//                         if (productMatch) {
//                             const lineItemId = await createLineItem(priceObj.name, productMatch.id)
//                             await createAssociation(match.id, lineItemId)
//                         } else {
//                             const productId = await createProduct(priceObj)
//                             const lineItemId = await createLineItem(priceObj.name, productId)
//                             await createAssociation(match.id, lineItemId)
//                         }
//                     }
//                     return
//                 } else {
//                     const dealId = await createDeal(priceObj, name, status)
//                     await associateContactToDeal(dealId, userId)
//                     const hubspotProducts = await getHubspotProducts([])
//                     const productMatch = hubspotProducts.find((item) => {
//                         return item.properties.name && item.properties.name === priceObj.name
//                     })
//                     if (productMatch) {
//                         const lineItemId = await createLineItem(priceObj.name, productMatch.id)
//                         await createAssociation(dealId, lineItemId)
//                     } else {
//                         const productId = await createProduct(priceObj)
//                         const lineItemId = await createLineItem(priceObj.name, productId)
//                         await createAssociation(dealId, lineItemId)
//                     }
//                 }
//             }
//         } else {
//             const dealId = await createDeal(priceObj, name, status)
//             await associateContactToDeal(dealId, userId)
//             const hubspotProducts = await getHubspotProducts([])
//             const productMatch = hubspotProducts.find((item) => {
//                 return item.properties && item.properties.name && item.properties.name === priceObj.name
//             })
//             if (productMatch) {
//                 const lineItemId = await createLineItem(priceObj.name, productMatch.id)
//                 await createAssociation(dealId, lineItemId)
//             } else {
//                 const productId = await createProduct(priceObj)
//                 const lineItemId = await createLineItem(priceObj.name, productId)
//                 await createAssociation(dealId, lineItemId)
//             }
//         }
//     } catch (e) {
//         console.log("ERROR", e);
//     }
// }

// manualAdd('cus_IaN5BVhrkJBHKV', 'prod_I53duMFVHVWu8K', 'plan_I53dfkf9wK92Wz')
// Authorify Digital+Plus Membership $97
// Annual Digital+Plus Membership $997


const successPayment = async (customerId, invoiceId) => {
    const customer = await stripe.customers.retrieve(customerId);
    const invoiceData = await stripe.invoices.retrieve(invoiceId);
    const email = customer.email
    const name = customer.name || customer.metadata.name
    const productPriceId = invoiceData.lines.data[0].price.id
    const priceObj = handlePrice(productPriceId)
    const userId = await getUserVID(email)
    let date = new Date()
    date = date.setUTCHours(0, 0, 0, 0)
    if (userId && invoiceData) {
        try {
            const deals = await getContactDeals(userId)
            let dealsWithData = await Promise.all(deals.map(async (deal) => {
                return await getDealData(deal)
            }))
            dealsWithData = dealsWithData.filter((deal) => {
                return deal.properties.pipeline && deal.properties.pipeline === '6808662'
            })
            const match = dealsWithData.find((ele) => {
                return ele.properties.dealname && (ele.properties.dealname === `${name} - ${priceObj.product}`) || (ele.properties.dealname === `${name} - ${priceObj.name}`)
            })
            if (match) {
                console.log("MATCH - UPDATING", match);
                const body = {
                    properties: {
                        "last_payment_date": date
                    }
                }
                await updateDeal(match.id, body)
            } else {
                console.log("NO MATCH - WAITING TO LOOK AGAIN");
                setTimeout(async () => {
                    const match = dealsWithData.find((ele) => {
                        return ele.properties.dealname && (ele.properties.dealname === `${name} - ${priceObj.product}`) || (ele.properties.dealname === `${name} - ${priceObj.name}`)
                    })
                    if (match) {
                        console.log("MATCH AT LAST - UPDATING");
                        const body = {
                            properties: {
                                "last_payment_date": date
                            }
                        }
                        await updateDeal(match.id, body)
                    } else {
                        console.log("WAITED - NO MATCH");
                    }
                }, 5000)
            }
        } catch (e) {
            console.log("ERROR: COULD NOT UPDATE DEAL");
        }
    }
}


successPayment("cus_IIIAvXKcbhm47J", "in_1IJhI9A4Qp1GGmkoYHCxUZe6")

const handleUpdate = async (dealId) => {
    try {

        let date = new Date()
        date = date.setUTCHours(0, 0, 0, 0)
        console.log("DATE", date);
        const body = {
            properties: {
                "last_payment_date": date
            }
        }
        await updateDeal(dealId, body)
    } catch (e) {
        console.log(e);
    }
}

// handleUpdate('4130535071')