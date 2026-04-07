from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch, Rectangle

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "images" / "docs" / "DL" / "IA2-QB"
OUT_DIR.mkdir(parents=True, exist_ok=True)


plt.rcParams.update(
    {
        "figure.dpi": 180,
        "font.size": 10,
        "axes.titlesize": 12,
        "axes.labelsize": 10,
    }
)


def add_box(ax, x, y, w, h, text, fc="#E6F0FF", ec="#355C7D", fs=9):
    box = FancyBboxPatch(
        (x, y),
        w,
        h,
        boxstyle="round,pad=0.02,rounding_size=0.05",
        linewidth=1.2,
        edgecolor=ec,
        facecolor=fc,
    )
    ax.add_patch(box)
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center", fontsize=fs)


def add_arrow(ax, x1, y1, x2, y2, text=None):
    arr = FancyArrowPatch((x1, y1), (x2, y2), arrowstyle="->", mutation_scale=12, linewidth=1.2, color="#333333")
    ax.add_patch(arr)
    if text:
        ax.text((x1 + x2) / 2, (y1 + y2) / 2 + 0.04, text, ha="center", va="bottom", fontsize=8)


def save(fig, name):
    # Keep background transparent so dark-mode invert/hue filters preserve diagram colors.
    fig.patch.set_alpha(0)
    for ax in fig.axes:
        ax.set_facecolor("none")
    fig.tight_layout()
    fig.savefig(
        OUT_DIR / name,
        bbox_inches="tight",
        transparent=True,
        facecolor="none",
        edgecolor="none",
    )
    plt.close(fig)


def fig_rnn_ops():
    fig, ax = plt.subplots(figsize=(11, 3.8))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    add_box(ax, 0.03, 0.57, 0.16, 0.2, "Input x_t\n(64 x 15)")
    add_box(ax, 0.24, 0.57, 0.16, 0.2, "W_xh\n(15 x 30)")
    add_box(ax, 0.03, 0.18, 0.16, 0.2, "Prev h_{t-1}\n(64 x 30)")
    add_box(ax, 0.24, 0.18, 0.16, 0.2, "W_hh\n(30 x 30)")

    add_box(ax, 0.47, 0.57, 0.16, 0.2, "x_t W_xh\nMul: 64 x 15 x 30")
    add_box(ax, 0.47, 0.18, 0.16, 0.2, "h_{t-1} W_hh\nMul: 64 x 30 x 30")

    add_box(ax, 0.70, 0.38, 0.13, 0.2, "Sum + tanh\n= h_t")
    add_box(ax, 0.86, 0.38, 0.12, 0.2, "h_t\n(64 x 30)")

    add_arrow(ax, 0.19, 0.67, 0.24, 0.67)
    add_arrow(ax, 0.19, 0.28, 0.24, 0.28)
    add_arrow(ax, 0.40, 0.67, 0.47, 0.67)
    add_arrow(ax, 0.40, 0.28, 0.47, 0.28)
    add_arrow(ax, 0.63, 0.67, 0.70, 0.48)
    add_arrow(ax, 0.63, 0.28, 0.70, 0.48)
    add_arrow(ax, 0.83, 0.48, 0.86, 0.48)

    per_step = 64 * (15 * 30 + 30 * 30)
    total = 20 * per_step
    ax.text(
        0.5,
        0.03,
        f"Per time step multiplications = {per_step:,} | Sequence length 20 => Total = {total:,}",
        ha="center",
        va="bottom",
        fontsize=10,
        color="#0B4F6C",
        fontweight="bold",
    )

    ax.set_title("RNN Forward-Pass Multiplication Count")
    save(fig, "Q1_RNN_Forward_Multiplications.png")


def fig_denoising_autoencoder():
    fig, ax = plt.subplots(figsize=(11, 3.6))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    x = np.array([1.0, 2.0, 3.0])
    x_noisy = np.array([1.2, 1.8, 3.1])
    we = np.array([[0.2, 0.3, 0.1], [0.1, 0.2, 0.3]])
    wd = np.array([[0.4, 0.1], [0.2, 0.2], [0.1, 0.3]])
    h = we @ x_noisy
    x_hat = wd @ h

    add_box(ax, 0.03, 0.38, 0.14, 0.24, f"Original x\n{x}", fc="#F4F1DE")
    add_box(ax, 0.22, 0.38, 0.16, 0.24, f"Noisy x~\n{x_noisy}", fc="#E07A5F", ec="#7A3E2B")
    add_box(ax, 0.43, 0.38, 0.16, 0.24, "Encoder\nW_e (2 x 3)")
    add_box(ax, 0.64, 0.38, 0.14, 0.24, f"Latent h\n{np.round(h, 3)}", fc="#81B29A")
    add_box(ax, 0.82, 0.38, 0.15, 0.24, f"Reconstruction x_hat\n{np.round(x_hat, 3)}", fc="#A8DADC")

    add_arrow(ax, 0.17, 0.50, 0.22, 0.50, "+ noise")
    add_arrow(ax, 0.38, 0.50, 0.43, 0.50)
    add_arrow(ax, 0.59, 0.50, 0.64, 0.50)
    add_arrow(ax, 0.78, 0.50, 0.82, 0.50)

    ax.text(
        0.5,
        0.07,
        "Q4-Q5 computed values: h = [1.09, 1.41], x_hat = [0.577, 0.500, 0.532]",
        ha="center",
        va="center",
        fontsize=10,
        fontweight="bold",
        color="#0B4F6C",
    )

    ax.set_title("Denoising Autoencoder Pipeline and Computation")
    save(fig, "Q4_Q5_Denoising_Autoencoder.png")


def fig_wavenet():
    fig, ax = plt.subplots(figsize=(11, 4))
    ax.set_xlim(-0.5, 15.5)
    ax.set_ylim(-0.8, 3.2)
    ax.axis("off")

    t = np.arange(16)
    ax.scatter(t, np.zeros_like(t), color="#1D3557", s=22)
    for i in t:
        ax.text(i, -0.25, str(i), ha="center", va="top", fontsize=8)

    target = 15

    def draw_layer(dilation, y, color):
        ax.hlines(y, 0, 15, colors="#CCCCCC", linestyles="dashed", linewidth=0.8)
        ax.text(-0.3, y, f"d={dilation}", ha="right", va="center", fontsize=9, color=color)
        for k in [0, 1, 2, 3]:
            idx = target - k * dilation
            if idx < 0:
                continue
            ax.scatter(idx, y, color=color, s=45)
            ax.plot([idx, target], [y, y], color=color, linewidth=1.5)

    draw_layer(1, 0.7, "#E63946")
    draw_layer(2, 1.5, "#457B9D")
    draw_layer(4, 2.3, "#2A9D8F")

    ax.annotate(
        "Output x_15 uses only past samples\n(causal, dilated convolutions)",
        xy=(15, 2.3),
        xytext=(10.5, 2.9),
        arrowprops=dict(arrowstyle="->", color="#333333"),
        fontsize=9,
        ha="left",
    )

    ax.set_title("WaveNet: Causal Dilated Convolutions")
    save(fig, "Q11_WaveNet_Causal_Dilated.png")


def fig_word2vec():
    fig, ax = plt.subplots(figsize=(10, 4))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    add_box(ax, 0.06, 0.39, 0.14, 0.22, "Center word\n\"learning\"", fc="#F1FAEE")
    add_box(ax, 0.33, 0.39, 0.16, 0.22, "Embedding\nLookup (W)")
    add_box(ax, 0.57, 0.39, 0.16, 0.22, "Hidden vector\n(semantic space)")
    add_box(ax, 0.80, 0.52, 0.16, 0.14, "Context: \"deep\"")
    add_box(ax, 0.80, 0.33, 0.16, 0.14, "Context: \"model\"")

    add_arrow(ax, 0.20, 0.50, 0.33, 0.50)
    add_arrow(ax, 0.49, 0.50, 0.57, 0.50)
    add_arrow(ax, 0.73, 0.54, 0.80, 0.59)
    add_arrow(ax, 0.73, 0.46, 0.80, 0.40)

    ax.text(0.5, 0.08, "Skip-gram learns embeddings by predicting nearby context words.", ha="center", fontsize=10)
    ax.set_title("Word2Vec (Skip-gram) Concept")
    save(fig, "Q12_Word2Vec_SkipGram.png")


def fig_face_recognition():
    fig, ax = plt.subplots(figsize=(11, 3.7))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    add_box(ax, 0.03, 0.36, 0.14, 0.26, "Input Face\nImage")
    add_box(ax, 0.21, 0.36, 0.14, 0.26, "Face\nDetection")
    add_box(ax, 0.39, 0.36, 0.14, 0.26, "Alignment\n(Eyes, Nose)")
    add_box(ax, 0.57, 0.36, 0.14, 0.26, "Embedding\n(128-D)", fc="#81B29A")
    add_box(ax, 0.75, 0.50, 0.21, 0.12, "Compare with database\n(Cosine / Euclidean)")
    add_box(ax, 0.75, 0.30, 0.21, 0.12, "Decision\n(Verify / Identify)", fc="#A8DADC")

    add_arrow(ax, 0.17, 0.49, 0.21, 0.49)
    add_arrow(ax, 0.35, 0.49, 0.39, 0.49)
    add_arrow(ax, 0.53, 0.49, 0.57, 0.49)
    add_arrow(ax, 0.71, 0.53, 0.75, 0.56)
    add_arrow(ax, 0.86, 0.50, 0.86, 0.42)

    ax.set_title("Deep Learning Face Recognition Pipeline")
    save(fig, "Q13_Face_Recognition_Pipeline.png")


def fig_semantic_segmentation():
    fig, axes = plt.subplots(1, 2, figsize=(9, 4))

    # Synthetic "image"
    img = np.zeros((8, 8, 3), dtype=float)
    img[:, :] = [0.72, 0.82, 0.95]  # sky
    img[4:, :] = [0.55, 0.55, 0.55]  # road
    img[3:7, 2:4] = [0.9, 0.1, 0.1]  # car
    img[2:6, 6:7] = [0.1, 0.7, 0.1]  # tree

    # Pixel-wise labels
    mask = np.zeros((8, 8), dtype=int)
    mask[4:, :] = 1
    mask[3:7, 2:4] = 2
    mask[2:6, 6:7] = 3

    axes[0].imshow(img)
    axes[0].set_title("Input Scene")
    axes[0].axis("off")

    cmap = plt.matplotlib.colors.ListedColormap(["#8EC9F2", "#7F7F7F", "#E63946", "#2A9D8F"])
    axes[1].imshow(mask, cmap=cmap, vmin=0, vmax=3)
    axes[1].set_title("Semantic Mask")
    axes[1].axis("off")

    handles = [
        Rectangle((0, 0), 1, 1, color="#8EC9F2", label="Sky"),
        Rectangle((0, 0), 1, 1, color="#7F7F7F", label="Road"),
        Rectangle((0, 0), 1, 1, color="#E63946", label="Car"),
        Rectangle((0, 0), 1, 1, color="#2A9D8F", label="Tree"),
    ]
    axes[1].legend(handles=handles, loc="lower center", bbox_to_anchor=(0.5, -0.2), ncol=4, frameon=False, fontsize=8)

    fig.suptitle("Semantic Segmentation: Pixel-wise Classification")
    save(fig, "Q14_Semantic_Segmentation.png")


def fig_image_captioning():
    fig, ax = plt.subplots(figsize=(11, 3.7))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    add_box(ax, 0.04, 0.37, 0.14, 0.24, "Image")
    add_box(ax, 0.23, 0.37, 0.16, 0.24, "CNN Encoder\n(Visual features)")
    add_box(ax, 0.45, 0.37, 0.16, 0.24, "Attention +\nDecoder (LSTM/Trf)")
    add_box(ax, 0.68, 0.58, 0.12, 0.12, "a")
    add_box(ax, 0.82, 0.58, 0.12, 0.12, "dog")
    add_box(ax, 0.68, 0.37, 0.12, 0.12, "runs")
    add_box(ax, 0.82, 0.37, 0.12, 0.12, "fast")

    add_arrow(ax, 0.18, 0.49, 0.23, 0.49)
    add_arrow(ax, 0.39, 0.49, 0.45, 0.49)
    add_arrow(ax, 0.61, 0.55, 0.68, 0.64)
    add_arrow(ax, 0.80, 0.64, 0.82, 0.64)
    add_arrow(ax, 0.61, 0.43, 0.68, 0.43)
    add_arrow(ax, 0.80, 0.43, 0.82, 0.43)

    ax.set_title("Automated Image Captioning Pipeline")
    save(fig, "Q15_Image_Captioning_Pipeline.png")


def fig_classification_vs_detection():
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))

    # Classification panel
    cls = np.ones((120, 120, 3), dtype=float)
    cls[:, :] = [0.95, 0.95, 0.95]
    cls[25:95, 30:90] = [0.8, 0.4, 0.2]
    axes[0].imshow(cls)
    axes[0].set_title("Image Classification")
    axes[0].text(60, 112, "Label: Cat", ha="center", va="center", fontsize=10, bbox=dict(facecolor="white", alpha=0.85, edgecolor="#333"))
    axes[0].axis("off")

    # Detection panel
    det = cls.copy()
    axes[1].imshow(det)
    axes[1].set_title("Object Detection")
    axes[1].add_patch(Rectangle((28, 22), 66, 76, fill=False, edgecolor="#E63946", linewidth=2.0))
    axes[1].text(30, 20, "Cat 0.96", color="#E63946", fontsize=9, bbox=dict(facecolor="white", alpha=0.8, edgecolor="none"))
    axes[1].add_patch(Rectangle((10, 70), 20, 30, fill=False, edgecolor="#2A9D8F", linewidth=1.8))
    axes[1].text(10, 67, "Ball 0.81", color="#2A9D8F", fontsize=8, bbox=dict(facecolor="white", alpha=0.8, edgecolor="none"))
    axes[1].axis("off")

    fig.suptitle("Classification vs Object Detection")
    save(fig, "Q16_Classification_vs_Detection.png")


def fig_rnn_unroll_numeric():
    fig, ax = plt.subplots(figsize=(11, 3.8))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    # Q18 values
    whh, wxh, why, bh, by = 0.4, 0.2, 0.6, 0.1, 0.2
    x1, x2 = 1.0, 2.0
    h0 = 0.0
    h1 = np.tanh(wxh * x1 + whh * h0 + bh)
    y1 = why * h1 + by
    h2 = np.tanh(wxh * x2 + whh * h1 + bh)
    y2 = why * h2 + by

    add_box(ax, 0.06, 0.45, 0.20, 0.25, f"t=1\nx1=1, h0=0\nh1=tanh(0.3)={h1:.4f}\ny1={y1:.4f}")
    add_box(ax, 0.40, 0.45, 0.20, 0.25, f"t=2\nx2=2, h1={h1:.4f}\nh2=tanh(0.6165)={h2:.4f}\ny2={y2:.4f}")
    add_box(ax, 0.74, 0.45, 0.20, 0.25, f"Error at t=2\ne = 1 - y2 = {1-y2:.4f}\n0.5*e^2 = {0.5*(1-y2)**2:.4f}", fc="#F4F1DE")

    add_arrow(ax, 0.26, 0.58, 0.40, 0.58)
    add_arrow(ax, 0.60, 0.58, 0.74, 0.58)

    ax.text(0.5, 0.18, "Hidden update: h_t = tanh(W_xh x_t + W_hh h_{t-1} + b_h),  Output: y_t = W_hy h_t + b_y", ha="center", fontsize=10)
    ax.set_title("RNN Unrolling and Numeric Computation (Q18)")
    save(fig, "Q18_RNN_Unroll_Numeric.png")


def main():
    fig_rnn_ops()
    fig_denoising_autoencoder()
    fig_wavenet()
    fig_word2vec()
    fig_face_recognition()
    fig_semantic_segmentation()
    fig_image_captioning()
    fig_classification_vs_detection()
    fig_rnn_unroll_numeric()

    print(f"Generated diagrams in: {OUT_DIR}")


if __name__ == "__main__":
    main()
