from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt

OUT_DIR = Path("public/images/docs/BDA/IA2/topic-4")
FG = "#f8fafc"  # Inverted/light strokes on transparent background
GRID = "#94a3b833"
ACCENT = "#60a5fa"


def _style_axes(ax, xlim=(0, 6), ylim=(0, 6), xlabel="x", ylabel="y", grid=False):
    ax.set_xlim(*xlim)
    ax.set_ylim(*ylim)
    ax.set_facecolor((0, 0, 0, 0))
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["bottom"].set_color(FG)
    ax.spines["left"].set_color(FG)
    ax.tick_params(colors=FG)
    ax.set_xlabel(xlabel, color=FG)
    ax.set_ylabel(ylabel, color=FG)
    if grid:
        ax.grid(True, color=GRID, linewidth=1)


def _save(fig, name: str):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT_DIR / name, dpi=220, transparent=True, bbox_inches="tight", pad_inches=0.08)
    plt.close(fig)


def diagram_01_euclidean_general():
    fig, ax = plt.subplots(figsize=(6.5, 4.2))
    _style_axes(ax, xlim=(0, 6), ylim=(0, 6), xlabel="x", ylabel="y")

    a = (1.2, 1.8)
    b = (5.0, 1.8)
    c = (5.0, 4.6)

    ax.plot([a[0], b[0]], [a[1], b[1]], color=FG, linewidth=2)
    ax.plot([b[0], c[0]], [b[1], c[1]], color=FG, linewidth=2)
    ax.plot([a[0], c[0]], [a[1], c[1]], color=ACCENT, linewidth=2.4)

    ax.scatter([a[0], b[0], c[0]], [a[1], b[1], c[1]], color=FG, s=18)
    ax.text(a[0] - 0.25, a[1] - 0.35, "A(x1,y1)", color=FG)
    ax.text(b[0] + 0.08, b[1] - 0.33, "B", color=FG)
    ax.text(c[0] + 0.08, c[1] + 0.03, "C(x2,y2)", color=FG)
    ax.text(2.7, 3.25, "Euclidean", color=ACCENT)

    _save(fig, "diagram-01-euclidean-general.png")


def diagram_02_euclidean_worked():
    fig, ax = plt.subplots(figsize=(6.5, 4.2))
    _style_axes(ax, xlim=(0, 6), ylim=(0, 7), xlabel="x", ylabel="y")

    a = (1, 2)
    b = (5, 2)
    c = (5, 6)

    ax.plot([a[0], b[0]], [a[1], b[1]], color=FG, linewidth=2)
    ax.plot([b[0], c[0]], [b[1], c[1]], color=FG, linewidth=2)
    ax.plot([a[0], c[0]], [a[1], c[1]], color=ACCENT, linewidth=2.4)

    ax.text(2.1, 1.6, "Base", color=FG)
    ax.text(5.15, 4.0, "Altitude", color=FG, rotation=90)
    ax.text(2.5, 4.8, "Hypotenuse", color=ACCENT)
    ax.scatter([a[0], b[0], c[0]], [a[1], b[1], c[1]], color=FG, s=18)
    ax.text(a[0] - 0.2, a[1] - 0.45, "A(1,2)", color=FG)
    ax.text(c[0] - 0.2, c[1] + 0.15, "C(5,6)", color=FG)
    ax.text(b[0] + 0.1, b[1] - 0.3, "B", color=FG)

    _save(fig, "diagram-02-euclidean-worked-example.png")


def diagram_03_dataset_grid():
    fig, ax = plt.subplots(figsize=(6.8, 4.5))
    _style_axes(ax, xlim=(0, 4.6), ylim=(0, 5.6), xlabel="x", ylabel="y", grid=True)

    points = {"X1": (1, 2), "X2": (3, 5), "X3": (2, 0), "X4": (4, 5)}
    for label, (x, y) in points.items():
        ax.scatter([x], [y], color=ACCENT if label == "X2" else FG, s=28)
        ax.text(x + 0.06, y + 0.1, label, color=FG)

    _save(fig, "diagram-03-dataset-grid-points.png")


def diagram_04_manhattan_path():
    fig, ax = plt.subplots(figsize=(6.2, 3.8))
    _style_axes(ax, xlim=(0, 6), ylim=(0, 6), xlabel="x", ylabel="y")

    x1 = (1, 2)
    turn = (5, 2)
    x2 = (5, 5)

    ax.plot([x1[0], turn[0]], [x1[1], turn[1]], color=FG, linewidth=2)
    ax.plot([turn[0], x2[0]], [turn[1], x2[1]], color=FG, linewidth=2)
    ax.plot([x1[0], x2[0]], [x1[1], x2[1]], color=ACCENT, linewidth=1.8, linestyle="--")

    ax.scatter([x1[0], x2[0]], [x1[1], x2[1]], color=FG, s=20)
    ax.text(x1[0] - 0.2, x1[1] - 0.35, "X1", color=FG)
    ax.text(x2[0] + 0.08, x2[1] + 0.05, "X2", color=FG)
    ax.text(2.05, 1.55, "|x2-x1|", color=FG)
    ax.text(5.2, 3.6, "|y2-y1|", color=FG, rotation=90)
    ax.text(1.65, 4.65, "Manhattan path", color=ACCENT)

    _save(fig, "diagram-04-manhattan-path.png")


def _table_figure(cells, row_labels, col_labels, name):
    fig, ax = plt.subplots(figsize=(7.2, 3.6))
    fig.patch.set_alpha(0.0)
    ax.set_axis_off()

    table = ax.table(
        cellText=cells,
        rowLabels=row_labels,
        colLabels=col_labels,
        cellLoc="center",
        loc="center",
    )

    table.auto_set_font_size(False)
    table.set_fontsize(12)
    table.scale(1.1, 1.5)

    for (_, _), cell in table.get_celld().items():
        cell.set_edgecolor(FG)
        cell.set_linewidth(1.2)
        cell.set_facecolor((0, 0, 0, 0))
        cell.get_text().set_color(FG)

    _save(fig, name)


def diagram_05_manhattan_matrix():
    cells = [
        ["0", "", "", ""],
        ["5", "0", "", ""],
        ["3", "6", "0", ""],
        ["6", "1", "7", "0"],
    ]
    _table_figure(cells, ["X1", "X2", "X3", "X4"], ["X1", "X2", "X3", "X4"], "diagram-05-manhattan-distance-matrix.png")


def diagram_06_euclidean_matrix():
    cells = [
        ["0", "", "", ""],
        ["3.61", "0", "", ""],
        ["2.24", "5.10", "0", ""],
        ["4.24", "1.00", "5.10", "0"],
    ]
    _table_figure(cells, ["X1", "X2", "X3", "X4"], ["X1", "X2", "X3", "X4"], "diagram-06-euclidean-distance-matrix.png")


def diagram_07_line_segment_points():
    fig, ax = plt.subplots(figsize=(5.8, 3.4))
    _style_axes(ax, xlim=(0, 4), ylim=(0, 6), xlabel="x", ylabel="y")

    p1 = (1, 2)
    p2 = (3, 5)
    ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color=ACCENT, linewidth=2.4)
    ax.plot([p1[0], p1[0]], [0, p1[1]], color=FG, linestyle="--", linewidth=1)
    ax.plot([p2[0], p2[0]], [0, p2[1]], color=FG, linestyle="--", linewidth=1)

    ax.scatter([p1[0], p2[0]], [p1[1], p2[1]], color=FG, s=22)
    ax.text(p1[0] - 0.2, p1[1] - 0.4, "X1", color=FG)
    ax.text(p2[0] + 0.08, p2[1], "X2", color=FG)

    _save(fig, "diagram-07-two-point-segment.png")


def diagram_08_delta_xy_general():
    fig, ax = plt.subplots(figsize=(6.4, 4.2))
    _style_axes(ax, xlim=(0, 6), ylim=(0, 6), xlabel="x", ylabel="y")

    p1 = (1.4, 2.0)
    p2 = (5.0, 5.0)

    ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color=ACCENT, linewidth=2.4)
    ax.plot([p1[0], p2[0]], [p1[1], p1[1]], color=FG, linewidth=2)
    ax.plot([p2[0], p2[0]], [p1[1], p2[1]], color=FG, linewidth=2)

    ax.annotate("", xy=(p2[0], p1[1] - 0.25), xytext=(p1[0], p1[1] - 0.25), arrowprops=dict(arrowstyle="->", color=FG, lw=1.4))
    ax.annotate("", xy=(p2[0] + 0.25, p1[1]), xytext=(p2[0] + 0.25, p2[1]), arrowprops=dict(arrowstyle="->", color=FG, lw=1.4))

    ax.text((p1[0] + p2[0]) / 2 - 0.2, p1[1] - 0.62, "x2 - x1", color=FG)
    ax.text(p2[0] + 0.35, (p1[1] + p2[1]) / 2 - 0.1, "y2 - y1", color=FG, rotation=90)
    ax.text(p1[0] - 0.3, p1[1] - 0.42, "(x1,y1)", color=FG)
    ax.text(p2[0] + 0.05, p2[1] + 0.05, "(x2,y2)", color=FG)

    _save(fig, "diagram-08-delta-xy-geometry.png")


def diagram_09_axes_reference():
    fig, ax = plt.subplots(figsize=(4.8, 3.6))
    _style_axes(ax, xlim=(0, 5), ylim=(0, 5), xlabel="x", ylabel="y")

    ax.plot([0, 1], [0, 0], color=FG, linewidth=2)
    ax.plot([0, 0], [0, 1], color=FG, linewidth=2)
    ax.plot([0, 0.55, 0.55, 0], [0.55, 0.55, 0, 0], color=FG, linewidth=1)
    ax.text(3.5, 0.2, "x-axis", color=FG)

    _save(fig, "diagram-09-coordinate-axes-reference.png")


def diagram_10_cosine_vectors():
    fig, ax = plt.subplots(figsize=(5.6, 4.2))
    _style_axes(ax, xlim=(0, 5), ylim=(0, 5), xlabel="x", ylabel="y")

    o = (0, 0)
    p1 = (1.8, 4.0)
    p2 = (4.0, 2.0)

    ax.annotate("", xy=p1, xytext=o, arrowprops=dict(arrowstyle="->", color=ACCENT, lw=2.2))
    ax.annotate("", xy=p2, xytext=o, arrowprops=dict(arrowstyle="->", color=FG, lw=2.2))
    ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color=FG, linestyle="--", linewidth=1.4)

    ax.text(p1[0] + 0.1, p1[1] + 0.05, "p1", color=FG)
    ax.text(p2[0] + 0.1, p2[1], "p2", color=FG)
    ax.text(2.95, 3.15, "d", color=FG)

    theta = plt.Circle(o, 0.9, fill=False, color=FG, linewidth=1.2)
    ax.add_patch(theta)
    ax.text(0.75, 0.7, "theta", color=FG)

    _save(fig, "diagram-10-cosine-vector-angle.png")


def diagram_11_movie_axes_example():
    fig, ax = plt.subplots(figsize=(6.2, 4.0))
    _style_axes(ax, xlim=(0, 1.2), ylim=(0, 1.2), xlabel="Action", ylabel="Comedy")

    avengers = (1, 0)
    minions = (0, 1)

    ax.scatter([avengers[0]], [avengers[1]], color=ACCENT, s=36)
    ax.scatter([minions[0]], [minions[1]], color=ACCENT, s=36)

    ax.text(avengers[0] - 0.12, avengers[1] + 0.08, "Avengers", color=FG)
    ax.text(minions[0] + 0.03, minions[1] + 0.03, "Minions", color=FG)
    ax.text(avengers[0] - 0.04, avengers[1] - 0.13, "[1,0]", color=FG)
    ax.text(minions[0] + 0.05, minions[1] - 0.11, "[0,1]", color=FG)

    _save(fig, "diagram-11-genre-axis-example.png")


def main():
    diagram_01_euclidean_general()
    diagram_02_euclidean_worked()
    diagram_03_dataset_grid()
    diagram_04_manhattan_path()
    diagram_05_manhattan_matrix()
    diagram_06_euclidean_matrix()
    diagram_07_line_segment_points()
    diagram_08_delta_xy_general()
    diagram_09_axes_reference()
    diagram_10_cosine_vectors()
    diagram_11_movie_axes_example()
    print(f"Generated 11 diagrams in: {OUT_DIR}")


if __name__ == "__main__":
    main()
