import { Grid, GridItem } from "./Grid";
import { Card } from "../Card";
export default { title: "Components/Grid", component: Grid };
export const Default = { render: () => <Grid columns={{base: 1, sm: 2, lg: 3}}><GridItem><Card>One</Card></GridItem><GridItem><Card>Two</Card></GridItem><GridItem><Card>Three</Card></GridItem></Grid> };
