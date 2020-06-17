import { SlotInterface } from "../interfaces/SlotInterface";

export function filterForClashes(timeSlots: Array<SlotInterface>) {
    return timeSlots.filter((timeSlot) => {
        let timeAvailable = true;
        const bookedSlots = timeSlots.filter(timeSlot => {(timeSlot.bookedBy) ? true : false});
        bookedSlots.forEach(bookedSlot => {
            if (bookedSlot.startTime.replace(':','.') < timeSlot.endTime.replace(':','.')
             || timeSlot.startTime.replace(':','/') < bookedSlot.endTime.replace(':','.')) {
                 timeAvailable = false;
             }
        });
        return timeAvailable;
    });
}