import { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";

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

        const rows = users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          actions: (
            <>
              <Button
                variant="contained"
                style={{ backgroundColor: "#4CAF50", color: "white" }}
                size="small"
                onClick={() => handleUpdate(user.id)}
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
        }));

        setUserData({ columns, rows });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdate = (id) => {
    console.log("Update user with ID:", id);
    // Implement update logic here
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
    </DashboardLayout>
  );
}

export default UsersTable;
