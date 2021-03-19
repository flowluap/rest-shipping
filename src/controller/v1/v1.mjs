async function info(req, res, next) {
    res.json({ "authors": ["Paul Wolf - flowluap"], "providers": [{ name: "dpd", methods: ["getLabel", "sanitizeAddress", "checkAddress"] }] })
}
export default { info }