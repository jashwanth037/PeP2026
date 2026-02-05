const complaints = [];

const displayComplaints = (req, res) => {
    res.status(200).json({
        "success": true,
        "message": "Displaying Complaints",
        "data": complaints
    })
}

const getComplaintById = (req, res) => {
    const { id } = req.params;
    const complaint = complaints.find((c) => c.id === Number(id));

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: "Complaint not found"
        });
    }

    res.status(200).json({
        success: true,
        data: complaint
    });
}

const addComplaints = (req, res) => {
    const { title, description, status } = req.body;

    if (!title || !description) return res.status(400).json({
        "message": "title and the description are both required"
    })

    const newComplaint = {
        "id": complaints.length + 1,
        "title": title,
        "description": description,
        "status": status || "pending"
    }
    complaints.push(newComplaint);
    res.status(200).json({
        "success": true,
        "message": "new Complaint Added",
        "data": newComplaint
    })
}


const deleteComplaint = (req, res) => {
    const { id } = req.params;
    const index = complaints.findIndex((complaint) => complaint.id === Number(id));
    if (index === -1) return res.send("NotFound(404)");

    complaints.splice(index, 1);
    res.send("Complaint Deleted");
}

const resolveComplaint = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ "message": "status is required" });

    const index = complaints.findIndex((complaint) => complaint.id === Number(id));
    if (index === -1) return res.status(404).json({ "message": "Complaint not found" });

    complaints[index].status = status;
    res.status(200).json({
        "success": true,
        "message": "Complaint status updated",
        "data": complaints[index]
    });
}

export { displayComplaints, addComplaints, deleteComplaint, resolveComplaint, getComplaintById };
