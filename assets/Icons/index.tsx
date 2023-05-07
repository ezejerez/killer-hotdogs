import * as React from "react";
import Svg, { SvgProps, G, Path } from "react-native-svg";

export const ToggleThemeIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 800 800" {...props}>
    <G>
      <G>
        <Path
          d="M400 800c220.91 0 400-179.09 400-400S620.91 0 400 0 0 179.09 0 400s179.09 400 400 400Zm0-80V80c176.73 0 320 143.27 320 320S576.73 720 400 720Z"
          fill={props.fill}
        />
      </G>
    </G>
  </Svg>
);
