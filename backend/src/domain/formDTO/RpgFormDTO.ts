/**
 * Interface representing the data transfer object for an RPG form.
 */
export interface RPGFormDTO {
    name: string,
    description: string,
    master?: number,
    active?: boolean
}