import { updateMasterState } from "../interfaces/FunctionTypes";
import { MenuObject } from "../interfaces/ObjectInterfaces";
import moize from "moize";

export const fetchElementIds: (menuObject: MenuObject) => Array<number> = moize(
	(menuObject: MenuObject) => {
		const ids = [menuObject.OID];
		if (menuObject.SubElements.length > 0) {
			menuObject.SubElements.forEach((e) => {
				const subIds = fetchElementIds(e);
				subIds.forEach((id: number) => ids.push(id));
			});
		}
		return ids;
	}
);

export const isLeaf = moize((menuObject: MenuObject) => {
	return menuObject.SubElements.length === 0;
});

const fetchLeaves: (MenuObject: MenuObject) => Array<number> = (menuObject) => {
	if (isLeaf(menuObject)) return [menuObject.OID];
	const leaves: Array<number> = [];
	menuObject.SubElements.forEach((e) => {
		const tmp = fetchLeaves(e);
		tmp?.forEach((id) => leaves.push(id));
	});
	return leaves;
};

export const findAllLeafNodes: (
	menuObjects: Array<MenuObject>
) => Array<number> = moize((menuObjects) => {
	if (menuObjects.length === 0) return [];
	const leafNodeIds: Array<number> = [];
	menuObjects.forEach((e) => {
		const leaves = fetchLeaves(e);
		leaves.forEach((leafId) => leafNodeIds.push(leafId));
	});
	return leafNodeIds;
});

export const toggleAll = (
	menuObject: MenuObject,
	masterState: Array<number>,
	changeState: updateMasterState
) => {
	const elementIds = fetchElementIds(menuObject);

	const allSelected = elementIds.every((activeIds: number) =>
		masterState.some((id: number) => id === activeIds)
	);

	if (allSelected) return changeState(elementIds, false);

	changeState(elementIds, true);
};

export const shouldBeChecked = (
	menuObject: MenuObject,
	masterState: Array<number>
) => {
	if (masterState.length === 0) return false;
	if (masterState.some((id) => id === menuObject.OID)) return true;
	if (isLeaf(menuObject)) return false;

	const ids = menuObject.SubElements.map((element) => element.OID);

	const noneChecked = !ids.some((id) =>
		masterState.some((masterId) => masterId === id)
	);

	return !noneChecked;
};

const selectionChecker = (
	menuObject: MenuObject,
	masterState: Array<number>
) => {
	const checkedElements: Array<number> = [];
	if (isLeaf(menuObject)) {
		if (shouldBeChecked(menuObject, masterState))
			checkedElements.push(menuObject.OID);
		return checkedElements;
	}
	menuObject.SubElements.forEach((e) => {
		selectionChecker(e, masterState)?.forEach((id) =>
			checkedElements.push(id)
		);
		if (shouldBeChecked(e, [...masterState, ...checkedElements]))
			checkedElements.push(e.OID);
	});

	if (shouldBeChecked(menuObject, [...masterState, ...checkedElements]))
		checkedElements.push(menuObject.OID);

	return checkedElements;
};

export const getNextState = (
	menuObjects: Array<MenuObject>,
	masterState: Array<number>
) => {
	const result: Array<number> = [];
	const checkedIds = menuObjects.map((e) => selectionChecker(e, masterState));
	checkedIds.forEach((arrayWithIds) => {
		arrayWithIds.forEach((id) => result.push(id));
	});
	return Array.from(new Set(result));
};
