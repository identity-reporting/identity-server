import { useState } from "react";
import {
  Box,
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  AddSharp,
  CheckCircleSharp,
  ErrorSharp,
  InfoSharp,
  KeyboardArrowDownSharp,
  RemoveSharp,
} from "@mui/icons-material";
import { GeneralObjectView } from "../../../components/ObjectView";
import { ClientErrorMessage } from "../../../components/ClientErrorMessage";
import { AssertionResult, FunctionTestResult } from "../types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../../components/Accordion";

type GenericTestResult = FunctionTestResult;

export const TestResultFunctionView: React.FC<{
  resultObject: FunctionTestResult;
}> = ({ resultObject }) => {
  return (
    <>
      <Grid container>
        <Grid item xs={12} display={"flex"} alignItems={"center"} mb={2}>
          <Typography variant="h5">{resultObject.name}</Typography>

          <Box sx={{ ml: 1 }}>
            {resultObject.isMocked ? (
              <Chip label="Mocked" color="info" size="small" />
            ) : resultObject.successful ? (
              <Chip label="Passed" color="success" size="small" />
            ) : (
              <Chip label="Failed" color="error" size="small" />
            )}
          </Box>
        </Grid>

        {resultObject.functionMeta && (
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<KeyboardArrowDownSharp />}>
                Passed Input
              </AccordionSummary>
              <AccordionDetails>
                <GeneralObjectView
                  sourceObject={resultObject.functionMeta.input}
                  name=""
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}
        {resultObject.functionMeta && !resultObject.functionMeta.error && (
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<KeyboardArrowDownSharp />}>
                Function's Output
              </AccordionSummary>
              <AccordionDetails>
                <GeneralObjectView
                  sourceObject={resultObject.functionMeta.output}
                  name=""
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}

        {resultObject.functionMeta && resultObject.functionMeta.error && (
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<KeyboardArrowDownSharp />}>
                Thrown Error
              </AccordionSummary>
              <AccordionDetails>
                <Typography color={"error"} variant="body2">
                  {resultObject.functionMeta.error}
                </Typography>
                {resultObject.functionMeta.stackTrace?.map((s) => (
                  <Typography color={"error"}>{s}</Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}

        <Grid item xs={12} sx={{ mt: 2 }}>
          {resultObject.successful ? (
            <TestResultSuccessView object={resultObject} />
          ) : (
            <TestResultFailView object={resultObject} />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export const TestResultSuccessView: React.FC<{ object: GenericTestResult }> = ({
  object,
}) => {
  return (
    <>
      {object.isMocked ? (
        <>
          <Grid xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<KeyboardArrowDownSharp />}>
                Mocked Output
              </AccordionSummary>
              <AccordionDetails>
                <GeneralObjectView sourceObject={object.mockedOutput} name="" />
              </AccordionDetails>
            </Accordion>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12} sx={{ my: 2 }}>
            {object.assertions.map((a) => (
              <AssertionSuccessView assertion={a} />
            ))}
          </Grid>
        </>
      )}
    </>
  );
};

export const TestResultFailView: React.FC<{ object: GenericTestResult }> = ({
  object,
}) => {
  const theme = useTheme();
  return (
    <>
      <Typography variant="h5">Failure Reasons</Typography>
      <List>
        {object.failureReasons?.map((r) => (
          <ListItem>
            <ListItemText>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ErrorSharp color="error" fontSize="medium" sx={{ mr: 1 }} />
                <Typography variant="body2">{r}</Typography>
              </Box>
            </ListItemText>
          </ListItem>
        ))}
      </List>
      {object.assertions.length ? (
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Assertions
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ bgcolor: theme.palette.background.default }}>
            {object.assertions.map((a) =>
              a.success ? (
                <AssertionSuccessView assertion={a} />
              ) : (
                <AssertionFailView assertion={a} />
              )
            )}
          </Grid>
        </Grid>
      ) : null}
    </>
  );
  // }
  // return null;
};

const AssertionSuccessView: React.FC<{
  assertion: AssertionResult;
}> = ({ assertion }) => {
  const theme = useTheme();
  return (
    <Accordion>
      <AccordionSummary expandIcon={<KeyboardArrowDownSharp />}>
        <Box display={"flex"} alignItems={"center"}>
          <Box mr={1}>
            {assertion.success ? (
              <CheckCircleSharp color="success" />
            ) : (
              <ErrorSharp color="error" />
            )}
          </Box>
          {assertion.name}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {assertion.expectedErrorMessage && (
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight={"bold"} sx={{ mb: 1 }}>
                Expected Error Message
              </Typography>
              <ClientErrorMessage
                message={assertion.expectedErrorMessage.message}
                color={theme.palette.success.dark}
                variant="subtitle1"
              />
            </Grid>
          </Grid>
        )}
        {assertion.ioConfig && (
          <Grid container>
            <Grid item xs={12}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"flex-start"}
              >
                <Box display={"flex"} my={1}>
                  <Typography fontWeight={"bold"} mr={1}>
                    Object Target:
                  </Typography>
                  <Typography>
                    Function's {assertion.ioConfig.target}
                  </Typography>
                </Box>
                <Box display={"flex"} my={1}>
                  <Typography fontWeight={"bold"} mr={1}>
                    Operator:
                  </Typography>
                  <Typography>{assertion.ioConfig.operator}</Typography>
                </Box>
              </Box>
              <Grid item xs={12} my={1}>
                <GeneralObjectDiff
                  sourceObject={assertion.ioConfig.object}
                  targetObject={assertion.ioConfig.receivedObject}
                  name={""}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

const AssertionFailView: React.FC<{
  assertion: AssertionResult;
}> = ({ assertion }) => {
  const theme = useTheme();
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<KeyboardArrowDownSharp />}>
        <Box display={"flex"}>
          <ErrorSharp color="error" sx={{ mr: 1 }} />

          {assertion.name}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {assertion.expectedErrorMessage && (
          <>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight={"bold"}>
                  Expected Error Message
                </Typography>
                <ClientErrorMessage
                  message={assertion.expectedErrorMessage.message}
                  color={theme.palette.success.dark}
                  variant="subtitle1"
                />
              </Grid>
              {assertion.expectedErrorMessage.receivedError && (
                <Grid item xs={12} mt={2}>
                  <Typography variant="body1" fontWeight={"bold"}>
                    Thrown Error Message
                  </Typography>
                  <ClientErrorMessage
                    message={assertion.expectedErrorMessage.receivedError || ""}
                    color={theme.palette.error.dark}
                    variant="subtitle1"
                  />
                </Grid>
              )}
              {!assertion.expectedErrorMessage.receivedError &&
                assertion.expectedErrorMessage.functionOutput && (
                  <Grid item xs={12} mt={2}>
                    <Typography variant="body1" fontWeight={"bold"}>
                      Function Output
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ my: 1, display: "flex", alignItems: "center" }}
                    >
                      <InfoSharp color="error" sx={{ mr: 1 }} />
                      This function was supposed to throw error but it executed
                      successfully.
                    </Typography>
                    <GeneralObjectView
                      name="Output"
                      sourceObject={
                        assertion.expectedErrorMessage.functionOutput
                      }
                    />
                  </Grid>
                )}
            </Grid>
          </>
        )}
        {assertion.ioConfig && (
          <Grid container>
            {!assertion.ioConfig.thrownError && (
              <Grid item xs={12}>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"flex-start"}
                >
                  <Box display={"flex"} my={1}>
                    <Typography fontWeight={"bold"} mr={1}>
                      Object Target:
                    </Typography>
                    <Typography>
                      Function's {assertion.ioConfig.target}
                    </Typography>
                  </Box>
                  <Box display={"flex"} my={1}>
                    <Typography fontWeight={"bold"} mr={1}>
                      Operator:
                    </Typography>
                    <Typography>{assertion.ioConfig.operator}</Typography>
                  </Box>
                </Box>

                <Grid
                  item
                  xs={12}
                  my={1}
                  sx={{ bgcolor: "#e7ecf0", p: 2, overflow: "scroll" }}
                >
                  <Box display={"flex"} alignItems={"center"} mb={1}>
                    <Box
                      sx={{ height: 15, width: 15, background: "green", mr: 1 }}
                    />
                    <Typography sx={{ mr: 1 }}>Expected</Typography>
                    <Box
                      sx={{ height: 15, width: 15, background: "red", mr: 1 }}
                    />
                    <Typography>Received</Typography>
                  </Box>
                  <GeneralObjectDiff
                    sourceObject={assertion.ioConfig.object}
                    targetObject={assertion.ioConfig.receivedObject}
                    name={""}
                  />
                </Grid>
              </Grid>
            )}
            {assertion.ioConfig.thrownError && (
              <Grid container>
                <Grid item xs={12} mt={2}>
                  <Typography variant="body1" fontWeight={"bold"}>
                    Expected Function Output
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ my: 1, display: "flex", alignItems: "center" }}
                  >
                    <InfoSharp color="error" sx={{ mr: 1 }} />
                    This function was supposed to return the following output
                    but it failed to execute successfully.
                  </Typography>
                  <GeneralObjectView
                    name="Expected Output"
                    sourceObject={assertion.ioConfig.object}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" fontWeight={"bold"}>
                    Thrown Error
                  </Typography>
                  <ClientErrorMessage
                    message={assertion.ioConfig.thrownError}
                    color={theme.palette.error.dark}
                    variant="subtitle1"
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

const ObjectDiff: React.FC<{
  sourceObject: any;
  targetObject: any;
  name: string;
}> = ({ sourceObject, targetObject, name }) => {
  const [showChildren, setShowChildren] = useState(true);

  const targetHasMoreKeys =
    Object.keys(targetObject || {}).length >
    Object.keys(sourceObject || {}).length;

  let targetObjectToIterateOver = sourceObject;
  if (targetHasMoreKeys) {
    targetObjectToIterateOver = targetObject;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          {name ? `${name}:` : null} {"{"}
        </Typography>
        <IconButton
          sx={{ p: 0 }}
          onClick={() => setShowChildren(!showChildren)}
        >
          {showChildren ? (
            <RemoveSharp
              sx={{
                border: "1px solid black",
                fontSize: 12,
                cursor: "pointer",
              }}
            />
          ) : (
            <>
              <AddSharp
                fontSize="inherit"
                sx={{
                  border: "1px solid black",
                  fontSize: 12,
                  cursor: "pointer",
                  mr: 1,
                }}
              />
              <Typography>{"}"}</Typography>
            </>
          )}
        </IconButton>
      </Box>

      {/* Children */}
      {(showChildren && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              ml: 0.2,
              mt: 1,
              pl: 2,
              borderLeft: "2px dashed black",
              "&:hover": {
                borderLeftColor: "blue",
              },
            }}
          >
            {Object.keys(targetObjectToIterateOver).map((k) => {
              return (
                <GeneralObjectDiff
                  sourceObject={sourceObject?.[k]}
                  targetObject={targetObject?.[k]}
                  name={k}
                />
              );
            })}
          </Box>
          <Typography>{"}"}</Typography>
        </>
      )) ||
        null}
    </Box>
  );
};

const ArrayDiff: React.FC<{
  sourceObject: any[];
  targetObject: any;
  name: string;
}> = ({ sourceObject, targetObject, name }) => {
  let hasChildren = true;
  let targetArrayToIterateOver = sourceObject;

  if (!Array.isArray(targetObject)) {
    // not iterable ?
    hasChildren = false;
  } else {
    if (targetObject.length > sourceObject.length) {
      targetArrayToIterateOver = targetObject;
    }
  }

  const [showChildren, setShowChildren] = useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          {name ? `${name}:` : null} {"["}
        </Typography>
        {hasChildren && (
          <IconButton
            sx={{ p: 0 }}
            onClick={() => setShowChildren(!showChildren)}
          >
            {showChildren ? (
              <RemoveSharp
                sx={{
                  border: "1px solid black",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              />
            ) : (
              <>
                <AddSharp
                  fontSize="inherit"
                  sx={{
                    border: "1px solid black",
                    fontSize: 12,
                    cursor: "pointer",
                    mr: 1,
                  }}
                />
                <Typography>{"]"}</Typography>
              </>
            )}
          </IconButton>
        )}
      </Box>

      {/* Children */}
      {(showChildren && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              ml: 0.2,
              mt: 1,
              pl: 2,
              borderLeft: "2px dashed black",
              "&:hover": {
                borderLeftColor: "blue",
              },
            }}
          >
            {targetArrayToIterateOver.map((_, k) => {
              return (
                <GeneralObjectDiff
                  sourceObject={sourceObject?.[k]}
                  targetObject={targetObject?.[k]}
                  name={""}
                />
              );
            })}
          </Box>
          <Typography>{"]"}</Typography>
        </>
      )) ||
        null}
    </Box>
  );
};

const GeneralObjectDiff: React.FC<{
  sourceObject: any;
  targetObject: any;
  name: string;
}> = (props) => {
  const { sourceObject, targetObject } = props;
  if (Array.isArray(sourceObject) && Array.isArray(targetObject)) {
    return <ArrayDiff {...props} />;
  } else if (
    sourceObject &&
    typeof sourceObject === "object" &&
    targetObject &&
    typeof targetObject === "object"
  ) {
    return <ObjectDiff {...props} />;
  } else {
    return <LiteralDiff {...props} />;
  }
};

const LiteralDiff: React.FC<{
  sourceObject: any;
  targetObject: any;
  name: string;
}> = ({ sourceObject, targetObject, name }) => {
  const theme = useTheme();

  const isMatch = sourceObject === targetObject;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {(sourceObject !== undefined && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0.3,
            ...(!isMatch
              ? {
                  bgcolor: theme.palette.success.light,
                  color: theme.palette.success.contrastText,
                }
              : {}),
          }}
        >
          <>
            <Typography
              color={isMatch ? undefined : "success"}
              variant="body2"
              sx={{ mr: 1 }}
            >
              {name ? `${name}:` : ""}
            </Typography>

            <Typography
              color={isMatch ? undefined : "success"}
              variant="body2"
              sx={{ mr: 1 }}
            >
              {JSON.stringify(sourceObject)}
            </Typography>
          </>
        </Box>
      )) ||
        null}
      {!isMatch && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              bgcolor: theme.palette.error.light,
              color: theme.palette.error.contrastText,
              p: 0.3,
            }}
          >
            <>
              <Typography
                variant="body2"
                sx={{
                  mr: 1,
                  textDecoration:
                    targetObject === undefined ? "line-through" : "",
                }}
              >
                {name ? `${name}:` : ""}
              </Typography>

              <Typography variant="body2" sx={{ mr: 1, whiteSpace: "nowrap" }}>
                {JSON.stringify(targetObject, null, 0)}
              </Typography>
            </>
          </Box>
          {targetObject === undefined && (
            <Typography
              variant="subtitle1"
              fontSize={10}
              fontStyle={"italic"}
              ml={1}
            >
              Undefined
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
