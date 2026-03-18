import rough from 'roughjs/bundled/rough.esm';

// The rough.js generator — lives outside the hook so it's created only once
const gen = rough.generator();

/**
 * Custom Hook: useCreateElement
 *
 * Encapsulates all the logic for building a drawable element
 * (line, rectangle, circle, polygon, triangle, text, pen)
 * based on the currently selected tool and its style options.
 *
 * @param {string}   tool           - Active drawing tool (e.g. "line", "rectangle")
 * @param {string}   color          - Stroke color
 * @param {string}   background     - Fill/background color
 * @param {string}   fillStyle      - Rough.js fill style (e.g. "solid", "hachure")
 * @param {number}   strokeWidth    - Width of the stroke
 * @param {number[]} strokeLineDash - Dash pattern array (e.g. [] for solid, [8,4] for dashed)
 *
 * @returns {{ createElement: Function }}
 *   createElement(x1, y1, x2, y2,,id) → element object ready to be stored in state
 */
const useCreateElement = (
    tool,
    color,
    background,
    fillStyle,
    strokeWidth,
    strokeLineDash
) => {

    /**
     * Creates a single drawable element based on the current tool.
     *
     * @param {number} x1 - Start X coordinate
     * @param {number} y1 - Start Y coordinate
     * @param {number} x2 - End X coordinate (current mouse position)
     * @param {number} y2 - End Y coordinate (current mouse position)
     * @param{number}id-Index of new element
     * @returns {object} - Element object (roughjs element, pen element, or text element)
     */
    const createElement = (x1, y1, x2, y2, id, toolOverride) => {
        // When moving, we pass the element's own type as toolOverride
        // so we don't accidentally use the current tool ("selection")
        const activeTool = toolOverride ?? tool;
        let roughEle = null;

        if (activeTool === 'line') {
            roughEle = gen.line(x1, y1, x2, y2, {
                roughness: 0,
                stroke: color,
                strokeWidth,
                strokeLineDash,
            });
        }

        else if (activeTool === 'rectangle') {
            roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1, {
                roughness: 0,
                stroke: color,
                fill: background,
                fillStyle,
                strokeWidth,
                strokeLineDash,
            });
        }

        else if (activeTool === 'circle') {
            const r = Math.hypot(x2 - x1, y2 - y1);
            roughEle = gen.circle(x1, y1, r * 2, {
                roughness: 0,
                stroke: color,
                fill: background,
                fillStyle,
                strokeWidth,
                strokeLineDash,
            });
        }

        else if (activeTool === 'polygon' || activeTool === 'triangle') {
            const sides = activeTool === 'polygon' ? 4 : 3;
            const r = Math.hypot(x2 - x1, y2 - y1);
            const angleStep = (Math.PI * 2) / sides;
            const initialAngle = -Math.PI / 2;

            const vertices = [];
            for (let i = 0; i < sides; i++) {
                const angle = initialAngle + i * angleStep;
                vertices.push([
                    x2 + r * Math.cos(angle),
                    y2 + r * Math.sin(angle),
                ]);
            }

            roughEle = gen.polygon(vertices, {
                roughness: 0,
                stroke: color,
                fill: background,
                fillStyle,
                strokeWidth,
                strokeLineDash,
            });
        }

        else if (activeTool === 'text') {
            return {
                type: 'text',
                id: id,
                x1,
                y1,
                text: 'Hello world',
            };
        }

        else if (activeTool === 'pen') {
            return {
                type: 'pen',
                id: id,
                x1,
                y1,
                color,
                points: [[x1, y1]],
            };
        }

        // Default: return a roughjs shape element
        return {
            type: activeTool,
            id,
            x1,
            y1,
            x2,
            y2,
            roughEle,
        };
    };

    // Expose createElement so the consuming component can call it
    return { createElement };
};

export default useCreateElement;
