type PageHeaderProps = {
  title: string;
  description: string;
};

const PageHeader = ({ description, title }: PageHeaderProps) => (
  <div>
    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
    <p className="to-muted-foreground">{description}</p>
  </div>
);

export default PageHeader;
