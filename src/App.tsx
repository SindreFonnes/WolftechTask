import React, { useState } from "react";
import styled from "styled-components";
import data from "./data/dummyData.json";
import { buildTreeFromArray } from "./helpers/listParser";
import Element from "./components/Element";
import { MenuObject } from "interfaces/ObjectInterfaces";
import { findAllLeafNodes, getNextState } from "helpers/ElementHelper";

const App = () => {
	const organizedTree = buildTreeFromArray(data);

	//If you want to display a preset of checked elements, edit the empty array here.
	const [checkedElements, setCheckedElements] = useState<Array<number>>([]);
	const [allowLeafOnly, setAllowLeafOnly] = useState<boolean>(true);
	const toggleAllowLeaf = () => {
		setAllowLeafOnly(!allowLeafOnly);
	};

	const leafObjectIds = findAllLeafNodes(organizedTree);

	const changeState = (ids: Array<number>, checked: boolean) => {
		const idArray = checkedElements.filter(
			(e) => !ids.some((id) => id === e)
		);
		if (checked) ids.forEach((id) => idArray.push(id));
		const nextState = getNextState(organizedTree, idArray);

		setCheckedElements(nextState);
	};

	return (
		<StyledApp leafOnly={allowLeafOnly}>
			<div className={"elementList"}>
				{organizedTree.map((e: MenuObject) => (
					<Element
						key={e.OID}
						menuObject={e}
						updateMasterState={changeState}
						masterState={checkedElements}
						indentation={0}
						leafOnly={allowLeafOnly}
					/>
				))}
			</div>
			<div className={"control"}>
				<button className={"leafOnly"} onClick={toggleAllowLeaf}>Leaf only</button>
				<p>Selected Ids are bellow:</p>
				[{checkedElements.map(id => {
					if (!leafObjectIds.some(leafId => leafId === id)) return null;
					return (<> {id}, </>);
				})}]
			</div>
		</StyledApp>
	);
};

export default React.memo(App);

const StyledApp: any = styled.div`
	background: white;
	height: 100%;
	margin-top: 0%;
	display: flex;
	flex-direction: row;
	top: 0;

	.control {
		margin-left: auto;
		width: 10rem;
	}

	.leafOnly {
		background: ${(props: any) => props.leafOnly ? "green": "red"};
	}

	.elementList {
		width: 20rem;
		display: flex;
		flex-direction: column;
	}
`;
