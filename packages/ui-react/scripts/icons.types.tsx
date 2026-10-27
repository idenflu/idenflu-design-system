import * as React from "react";
import { PlusIcon, type SvgIconProps } from "@idenflu/ui-react/icons";

const props: SvgIconProps = { size: 20, label: "추가" };
const ref = React.createRef<SVGSVGElement>();
<PlusIcon {...props} ref={ref} className="custom" onClick={() => undefined} />;
<PlusIcon />;

// @ts-expect-error Individual icons accept numeric sizes only.
<PlusIcon size="medium" />;
// @ts-expect-error Drawings cannot be replaced by consumers.
<PlusIcon>
  <path />
</PlusIcon>;
// @ts-expect-error Individual icons have no sprite URL.
<PlusIcon spriteHref="icons.svg" />;
// @ts-expect-error Icon selection is encoded in the component name.
<PlusIcon name="plus" />;
// @ts-expect-error Raw markup cannot replace the generated drawing.
<PlusIcon dangerouslySetInnerHTML={{ __html: "" }} />;
