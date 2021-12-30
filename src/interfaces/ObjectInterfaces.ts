export interface DataObject {
	OID: number,
	Title: string,
	Color: string,
	DepartmentParent_OID: number | null,
	SubElements?: Array<MenuObject>
}

export interface MenuObject {
	OID: number,
	Title: string,
	Color: string,
	DepartmentParent_OID: number | null,
	SubElements: Array<MenuObject>
}