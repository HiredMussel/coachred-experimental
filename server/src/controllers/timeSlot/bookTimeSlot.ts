// Logic Structure:

// A once-off slot can be booked in any slot type.
// A repeating slot must be booked in the matching type (logic for allowing fortnightly booking of a weekly slot is
// ideal, but a stretch goal at this point)
// If a slot is booked, a check is first run to ensure that there are no clashes. If there are clashes, booking the 
// slot is impossible and a message should be returned.