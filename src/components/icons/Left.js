export default function Left({disabled}) {

    if (disabled) {
        // Render the SVG for disabled state
        return (
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="46"
            height="46"
            className="cursor-default"
            fill="none"
            viewBox="0 0 46 46"
          >
            <g filter="url(#filter0_d_393_1406)">
              <circle cx="22" cy="21" r="17" fill="#D8D8D8"></circle>
              <circle cx="22" cy="21" r="16.5" stroke="#8A8A8A"></circle>
            </g>
            <path
              fill="#8A8A8A"
              d="M24.813 26.816l-.93.872-7.695-7.188 7.695-7.188.93.868-6.761 6.32 6.76 6.316z"
            ></path>
            <defs>
              <filter
                id="filter0_d_393_1406"
                width="44.4"
                height="44.4"
                x="0.8"
                y="0.8"
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                ></feColorMatrix>
                <feMorphology
                  in="SourceAlpha"
                  operator="dilate"
                  radius="1"
                  result="effect1_dropShadow_393_1406"
                ></feMorphology>
                <feOffset dx="1" dy="2"></feOffset>
                <feGaussianBlur stdDeviation="2.1"></feGaussianBlur>
                <feComposite in2="hardAlpha" operator="out"></feComposite>
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
                <feBlend
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_393_1406"
                ></feBlend>
                <feBlend
                  in="SourceGraphic"
                  in2="effect1_dropShadow_393_1406"
                  result="shape"
                ></feBlend>
              </filter>
            </defs>
          </svg>
        );
      } else {
        // Render the SVG for enabled state
        return(
            <svg
        xmlns="http://www.w3.org/2000/svg"
        width="46"
        height="46"
        fill="none"
        viewBox="0 0 46 46"
        >
        <g filter="url(#filter0_d_393_1406)">
            <circle cx="22" cy="21" r="17" fill="#fff"></circle>
            <circle cx="22" cy="21" r="16.5" stroke="#8A8A8A"></circle>
        </g>
        <path
            fill="#8A8A8A"
            d="M24.813 26.816l-.93.872-7.695-7.188 7.695-7.188.93.868-6.761 6.32 6.76 6.316z"
        ></path>
        <defs>
            <filter
            id="filter0_d_393_1406"
            width="44.4"
            height="44.4"
            x="0.8"
            y="0.8"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            >
            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
            <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            ></feColorMatrix>
            <feMorphology
                in="SourceAlpha"
                operator="dilate"
                radius="1"
                result="effect1_dropShadow_393_1406"
            ></feMorphology>
            <feOffset dx="1" dy="2"></feOffset>
            <feGaussianBlur stdDeviation="2.1"></feGaussianBlur>
            <feComposite in2="hardAlpha" operator="out"></feComposite>
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
            <feBlend
                in2="BackgroundImageFix"
                result="effect1_dropShadow_393_1406"
            ></feBlend>
            <feBlend
                in="SourceGraphic"
                in2="effect1_dropShadow_393_1406"
                result="shape"
            ></feBlend>
            </filter>
        </defs>
        </svg>
        )
    }
}