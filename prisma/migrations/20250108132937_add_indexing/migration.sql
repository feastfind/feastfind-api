-- CreateIndex
CREATE INDEX "City_id_slug_idx" ON "City"("id", "slug");

-- CreateIndex
CREATE INDEX "MenuItem_id_slug_idx" ON "MenuItem"("id", "slug");

-- CreateIndex
CREATE INDEX "User_id_username_email_idx" ON "User"("id", "username", "email");
