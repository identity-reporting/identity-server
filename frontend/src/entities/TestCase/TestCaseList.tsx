import { useEffect, useState } from "react";
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { DeleteSharp, PlayArrowSharp } from "@mui/icons-material";
import { Link } from "react-router-dom";

import { TestCaseServices } from "./services";
import { PageContainer } from "../../components/PageContainer";
import { PageTitle } from "../../components/PageTitle";
import { Filter } from "../../components/Filter";
import { TestCaseRoutes } from "./routes";
import { useFilters } from "../../hooks/useFilters";
import { TestSuiteForFunction } from "./types";

export const TestCaseList: React.FC<any> = () => {

  const [filters, setFilters] = useFilters(["moduleName", "fileName", "name"])
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TestSuiteForFunction[]>([]);

  useEffect(() => {
    setLoading(true);
    TestCaseServices.getAllTestCases().then(res => {
      setLoading(false);
      setData(res);
    })
  }, [filters])

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <PageContainer>
        <PageTitle title="Test Suites">
          <Link
            to={`/test-run/run-all-tests?${new URLSearchParams(
              filters
            ).toString()}`}
          >
            <Button variant="outlined">
              <PlayArrowSharp sx={{ mr: 1 }} />
              Run Tests
            </Button>
          </Link>
        </PageTitle>

        <Grid container>
          <Grid item xs={12} my={1}>
            <Filter
              filters={filters || {}}
              filterMap={{
                name: "Function Name",
                fileName: "File Name",
                moduleName: "Module Name",
              }}
              onFilter={setFilters}
              title="Filter Test Suites"
            />
          </Grid>

          <Grid item xs={12}>
            {data && (
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>File Name</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((d: any) => (
                      <TableRow>
                        <TableCell>
                          <Link
                            to={`${TestCaseRoutes.ViewTestCase}/${d.id}`}
                          >
                            {d.name}{" "}
                          </Link>
                        </TableCell>

                        <TableCell>
                          <Link
                            to={`${TestCaseRoutes.ViewTestCase}/${d.id}`}
                          >
                            {d.description}
                          </Link>
                        </TableCell>

                        <TableCell>
                          <Link
                            to={`${TestCaseRoutes.ViewTestCase}/${d.id}`}
                          >
                            {d.functionMeta?.fileName}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              setLoading(true);

                              fetch(
                                `http://localhost:8002/test_case/delete-test-case/${d.id}`,
                                {
                                  method: "POST",
                                }
                              ).then(() => {
                                setLoading(false);
                                window.location.reload();
                              });
                            }}
                            sx={{ mr: 1 }}
                          >
                            <DeleteSharp />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
};
