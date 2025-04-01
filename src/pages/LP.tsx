import React from "react";

const LP = () => {
	return (
		<div
			style={{
				fontFamily: "sans-serif",
				backgroundColor: "#f7f7f7",
				padding: "2rem",
			}}
		>
			{/* タイトルページ */}
			<section
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<img
					src="/tree-image.png"
					alt="Tree Graphic"
					style={{ maxWidth: "40%" }}
				/>
				<div>
					<p style={{ fontSize: "1rem", fontWeight: "bold" }}>
						あなたのひとりごとが、社会の声になる。
					</p>
					<h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>APP NAME</h1>
					<button
						style={{
							backgroundColor: "#4a84c0",
							color: "white",
							border: "none",
							borderRadius: "30px",
							padding: "1rem 2rem",
							fontSize: "1.2rem",
							marginTop: "1rem",
							cursor: "pointer",
						}}
					>
						START NOW
					</button>
				</div>
			</section>

			{/* 課題セクション */}
			<section style={{ marginTop: "4rem", textAlign: "center" }}>
				<h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>
					言いたいけど言えない。つぶやきたいけど届かない。
				</h2>
				<p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
					APP NAMEは、そんな“もどかしさ”を解消する新しいSNSです。
				</p>
			</section>

			{/* 機能セクション */}
			<section style={{ marginTop: "4rem" }}>
				<h2>APP NAMEの2つの機能</h2>

				<div
					style={{
						backgroundColor: "#d7eaf7",
						padding: "1.5rem",
						borderRadius: "10px",
						marginTop: "1rem",
					}}
				>
					<h3 style={{ fontWeight: "bold" }}>個人ではなく、集団との対話。</h3>
					<p>
						あなたの投稿は、ユーザー一人ひとりに届くのではなく、集団の声に溶け込みます。
						そして、あなたに届けられるのは、集団の声。
						つぶやくのは誰にも見えないひとりごとだけど、まわりの反応は見える不思議な体験。
					</p>
				</div>

				<div
					style={{
						backgroundColor: "#e7f5e6",
						padding: "1.5rem",
						borderRadius: "10px",
						marginTop: "1.5rem",
					}}
				>
					<h3 style={{ fontWeight: "bold" }}>対話を通して、声を育てる。</h3>
					<p>
						集団との対話を重ねることで、集団の声は育っていきます。
						さまざまな思い、意見、共感が生まれ、深化し、新たなトピックへと進化。
						ただの壁打ちでじゃない、新しい交流の形です。
					</p>
				</div>
			</section>
		</div>
	);
};

export default LP;
