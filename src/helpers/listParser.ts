import moize from "moize";
import { DataObject, MenuObject } from "./../interfaces/ObjectInterfaces";

type MenuObjectArray = Array<MenuObject>;

const handleElementInsertion = (element: MenuObject, list: MenuObjectArray) => {
	for (const parent of list) {
		const hasChildren =
			parent?.SubElements !== undefined &&
			parent?.SubElements?.length !== 0;
		if (hasChildren) {
			const foundParent = handleElementInsertion(
				element,
				parent.SubElements
			);
			if (foundParent) return true;
		}

		if (parent?.OID === element.DepartmentParent_OID) {
			parent?.SubElements?.push(element);
			return true;
		}
	}

	return false;
};

const findTopElements = (elements: MenuObjectArray) => {
	const result = [];
	for (const element of elements) {
		if (element.DepartmentParent_OID === null) {
			result.push(element);
		}
	}
	return result;
};

const handleNonTopElements = (list: MenuObjectArray, data: MenuObjectArray) => {
	const remainder = [];
	for (const element of data) {
		const success = handleElementInsertion(element, list);
		if (!success) remainder.push(element);
	}

	if (remainder.length > 0) handleNonTopElements(list, remainder);
};

const checkForNonExistantParents = (data: MenuObjectArray) => {
	const allIds = data.map((e) => e.OID);
	const nodesWithoutParent = [];
	for (const element of data) {
		if (element.DepartmentParent_OID === null) continue;
		const parentExists = allIds.some(
			(id) => id === element.DepartmentParent_OID
		);
		if (!parentExists) nodesWithoutParent.push(element);
	}

	const existsParentlessNodes = nodesWithoutParent.length > 0;
	if (existsParentlessNodes) {
		console.log("These nodes have a non-existant parent:");
		console.log(nodesWithoutParent);
	}
	return existsParentlessNodes;
};

export const buildTreeFromArray: any = moize((data: Array<DataObject>) => {
	const parsedData: Array<MenuObject> = data.map((e) => ({
		...e,
		SubElements: [],
	}));
	const result = findTopElements(parsedData);
	if (checkForNonExistantParents(parsedData))
		return console.log(
			"Logic error. Non-top nodes referencing unknown parent exits."
		);

	handleNonTopElements(
		result,
		parsedData.filter((e) => !result.some((x) => x.OID === e.OID))
	);

	return result;
});
