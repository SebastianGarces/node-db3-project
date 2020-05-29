const db = require("../data/db-config")

module.exports = {
	find,
	findById,
	findSteps,
	add,
	update,
	remove,
}

async function find() {
	const schemes = await db("schemes")
	return schemes
}

async function findById(id) {
	if (!id) throw "Id is required"

	const scheme = await db("schemes").where({ id }).first()
	if (!scheme) return null
	return scheme
}

async function findSteps(id) {
	if (!id) throw "Id is required"

	const steps = await db("schemes as s")
		.join("steps as st", "s.id", "st.scheme_id")
		.select("s.id", "s.scheme_name", "st.step_number", "st.instructions")

	return steps
}

async function add(scheme) {
	if (!scheme) throw "Scheme is required"

	const [newSchemeId] = await db("schemes").insert(scheme)
	const newScheme = await findById(newSchemeId)

	return newScheme
}

async function update(changes, id) {
	if (!changes || !id) throw "Changes and Id are required"

	const updateSuccess = await db("schemes").where({ id }).update(changes)

	if (updateSuccess > 0) {
		const updatedScheme = await findById(id)
		return updatedScheme
	}

	throw "Unable to update"
}

async function remove(id) {
	if (!id) throw "Id is required"

	const deletedScheme = await findById(id)
	if (!deletedScheme) return null

	const deleteSuccess = await db("schemes").where({ id }).del()

	if (deleteSuccess > 0) {
		return deletedScheme
	}
}
