import { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function UsersTable() {
  const [userData, setUserData] = useState({ columns: [], rows: [] });
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ id: "", name: "", email: "", password: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/curd");
        const users = response.data;

        const columns = [
          { Header: "ID", accessor: "id" },
          { Header: "Name", accessor: "name" },
          { Header: "Email", accessor: "email" },
          { Header: "Actions", accessor: "actions" },
        ];

        const formatUser = (user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          actions: (
            <>
              <Button
                variant="contained"
                style={{ backgroundColor: "#4CAF50", color: "white" }}
                size="small"
                onClick={() => handleOpenUpdate(user)}
              >
                Update
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: "#F44336", color: "white", marginLeft: "10px" }}
                size="small"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </Button>
            </>
          ),
        });

        setUserData({ columns, rows: users.map(formatUser) });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenUpdate = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/curd/${selectedUser.id}`, selectedUser);
      setUserData((prevData) => ({
        ...prevData,
        rows: prevData.rows.map((row) =>
          row.id === selectedUser.id ? { ...selectedUser, actions: row.actions } : row
        ),
      }));
      setOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/curd/${id}`);
      setUserData((prevData) => ({
        ...prevData,
        rows: prevData.rows.filter((row) => row.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Users Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={userData}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Update Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={selectedUser.name}
            onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={selectedUser.email}
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={selectedUser.password}
            onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default UsersTable;
