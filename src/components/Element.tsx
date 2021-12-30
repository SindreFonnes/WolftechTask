import { updateMasterState } from "interfaces/FunctionTypes";
import React, { useState } from "react";
import styled from "styled-components";
import { findAllLeafNodes, isLeaf, toggleAll } from "../helpers/ElementHelper";
import { MenuObject } from "../interfaces/ObjectInterfaces";

const Element = React.memo(function Element({
	menuObject,
	indentation,
	masterState,
	updateMasterState,
	leafOnly,
}: {
	menuObject: MenuObject;
	indentation: number;
	masterState: Array<number>;
	updateMasterState: updateMasterState;
	leafOnly: boolean;
}) {
	const isChecked = masterState.some((id) => id === menuObject.OID);
	const leafObjectIds = findAllLeafNodes(menuObject.SubElements);
	const selectedSubElements = leafObjectIds.filter((id: number) =>
		masterState.some((masterId) => masterId === id)
	);
	const elementIsLeaf = isLeaf(menuObject);

	const toggleElements = () => {
		if (leafOnly && !elementIsLeaf) return;
		toggleAll(menuObject, masterState, updateMasterState);
	};

	const [displayChildren, setDisplayChildren] = useState(true);

	const toggleDisplayChildren = () => {
		setDisplayChildren(!displayChildren);
	};

	return (
		<StyledElement
			backgroundColor={menuObject.Color}
			indentation={indentation + "rem"}
		>
			<div className={"mainElement"}>
				<div className={"leftArrow"} onClick={toggleDisplayChildren}>
					{!elementIsLeaf && (displayChildren ? (
						<div className={"displayChildren"} />
					) : (
						<div className={"dontDisplayChildren"} />
					))}
				</div>
				<div className={"elementInfo"} onClick={toggleElements}>
					{menuObject.Title}
					<div className={"amountSelected"}>
						{leafObjectIds.length > 0 &&
							`${selectedSubElements.length} / ${leafObjectIds.length}`}
					</div>
					<div className="checkMark">
						{isChecked &&
							(elementIsLeaf ||
								selectedSubElements.length > 0) && (
							<div className={"checked"} />
						)}
					</div>
				</div>
			</div>
			<div className={"childrenElements"}>
				{!elementIsLeaf &&
					displayChildren &&
					menuObject.SubElements.map((e) => (
						<Element
							key={e.OID}
							menuObject={e}
							indentation={indentation + 0.6}
							masterState={masterState}
							updateMasterState={updateMasterState}
							leafOnly={leafOnly}
						/>
					))}
			</div>
		</StyledElement>
	);
});

export default Element;

const StyledElement: any = styled.div`
	--element-height: 1.2rem;
	--border-radius: 0.4rem;
	--indentation: ${(props: any) => props.indentation};

	width: calc(20rem - var(--indentation));
	display: flex;
	flex-direction: column;
	position: relative;
	margin: 0.1rem 0.1rem 0.1rem 0.6rem;

	.elementInfo {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100%;
	}

	.displayChildren {
		margin: auto;
		height: 0.25rem;
		width: 0.25rem;
		transform: rotate(45deg);
		border-bottom: 0.1rem solid black;
		border-right: 0.1rem solid black;
		margin-right: auto;
		margin-top: auto;
		margin-bottom: auto;
	}

	.dontDisplayChildren {
		margin: auto;
		height: 0.25rem;
		width: 0.25rem;
		transform: rotate(45deg);
		border-top: 0.1rem solid black;
		border-right: 0.1rem solid black;
		margin-right: auto;
		margin-top: auto;
		margin-bottom: auto;
	}

	.mainElement {
		background: ${(props: any) => props.backgroundColor || "white"};
		display: flex;
		flex-direction: row;
		border-radius: var(--border-radius);
		height: var(--element-height);
		width: 100%;
	}

	.leftArrow {
		width: var(--element-height);
		left: 0.6rem;
		height: 100%;
		background: linear-gradient(
			to left,
			${(props: any) => props.backgroundColor},
			#9c9999 25%
		);
		border-radius: var(--border-radius) 0 0 var(--border-radius);
		display: flex;
	}

	.amountSelected {
		margin-left: auto;
		height: 100%;
		width: 3rem;
	}

	.checkMark {
		display: flex;
		position: relative;
		width: var(--element-height);
		height: 100%;
		right: 0.6rem;
		border-radius: var(--border-radius);
	}

	.checked {
		margin: auto;
		height: 0.5rem;
		width: 0.25rem;
		transform: rotate(45deg);
		border-bottom: 0.2rem solid black;
		border-right: 0.2rem solid black;
	}
`;
